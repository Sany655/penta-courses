from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import backend.app.models as m
from backend.app.services.graph_engine import KnowledgeGraphService
from backend.app.services.learner_state import LearnerStateService

class GoalEngineService:
    @staticmethod
    def analyze_goal_gap(db: Session, user_id: str, goal_id: str) -> Dict[str, Any]:
        goal = db.query(m.Goal).filter(m.Goal.id == goal_id, m.Goal.user_id == user_id).first()
        if not goal:
            raise ValueError("Goal not found")

        domain_id = goal.domain_id
        G = KnowledgeGraphService.build_domain_graph(db, domain_id)

        target_concept_ids = set()
        if goal.target_concept_ids:
            target_concept_ids = set(goal.target_concept_ids)
        else:
            # All concepts in domain
            target_concept_ids = set(G.nodes)

        # Find all required prerequisite ancestors for targets
        all_required_concept_ids = set(target_concept_ids)
        for tid in target_concept_ids:
            ancestors = KnowledgeGraphService.get_prerequisites(G, tid, recursive=True)
            all_required_concept_ids.update(ancestors)

        concepts = db.query(m.Concept).filter(m.Concept.id.in_(all_required_concept_ids)).all()
        concept_states = db.query(m.LearnerConceptState).filter(
            m.LearnerConceptState.user_id == user_id,
            m.LearnerConceptState.concept_id.in_(all_required_concept_ids)
        ).all()

        state_map = {s.concept_id: s for s in concept_states}

        mastered = []
        weak = []
        unknown = []
        actionable = []
        blocked = []
        total_minutes = 0

        for c in concepts:
            s = state_map.get(c.id)
            if s and s.mastery is not None and s.mastery >= 0.70:
                mastered.append(c)
            elif s and s.mastery is not None:
                weak.append(c)
                total_minutes += (c.estimated_learning_effort or 20)
            else:
                unknown.append(c)
                total_minutes += (c.estimated_learning_effort or 20)

            # Prerequisite readiness check
            if not (s and s.mastery is not None and s.mastery >= 0.70):
                is_ready, _, _ = KnowledgeGraphService.check_prerequisites_satisfied(db, G, user_id, c.id)
                if is_ready:
                    actionable.append(c)
                else:
                    blocked.append(c)

        total_count = len(all_required_concept_ids)
        mastered_count = len(mastered)
        pct = round((mastered_count / max(1, total_count)) * 100, 1)

        # Update goal progress in DB
        goal.progress = pct / 100.0
        if pct >= 100.0:
            goal.status = 'COMPLETED'
            goal.completed_at = datetime.now(timezone.utc)
        db.commit()

        return {
            'goal_id': goal.id,
            'title': goal.title,
            'completion_percentage': pct,
            'total_concepts': total_count,
            'mastered_count': mastered_count,
            'weak_count': len(weak),
            'unknown_count': len(unknown),
            'actionable_count': len(actionable),
            'blocked_count': len(blocked),
            'estimated_remaining_hours': round(total_minutes / 60.0, 1),
            'actionable_concepts': [{'id': c.id, 'name': c.name, 'slug': c.slug} for c in actionable],
            'blocked_concepts': [{'id': c.id, 'name': c.name, 'slug': c.slug} for c in blocked]
        }

    @staticmethod
    def generate_diagnostic_probe(db: Session, user_id: str, goal_id: str) -> List[Dict[str, Any]]:
        gap = GoalEngineService.analyze_goal_gap(db, user_id, goal_id)
        goal = db.query(m.Goal).filter(m.Goal.id == goal_id).first()

        G = KnowledgeGraphService.build_domain_graph(db, goal.domain_id)
        # Select representative concepts across topological layers (roots, intermediates, targets)
        probes = []
        domain_activities = db.query(m.Activity).join(m.Concept, m.Activity.concept_id == m.Concept.id).filter(
            m.Concept.domain_id == goal.domain_id
        ).limit(5).all()

        for a in domain_activities:
            probes.append({
                'activity_id': a.id,
                'concept_id': a.concept_id,
                'title': a.title,
                'activity_type': a.activity_type,
                'archetype': a.archetype,
                'difficulty': a.difficulty,
                'data_json': a.data_json
            })
        return probes

    @staticmethod
    def process_diagnostic_probe_results(
        db: Session,
        user_id: str,
        goal_id: str,
        results: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        for res in results:
            cid = res.get('concept_id')
            score = float(res.get('score', 0.8))
            if score >= 0.70:
                LearnerStateService.record_diagnostic_mastery(db, user_id, concept_id=cid, mastery_level=score)
            else:
                LearnerStateService.record_evidence(
                    db, user_id, concept_id=cid, evidence_type=m.EvidenceType.PROBLEM_SOLVING, score=score
                )

        updated_gap = GoalEngineService.analyze_goal_gap(db, user_id, goal_id)
        return updated_gap
