from datetime import datetime, timezone, timedelta
from typing import List, Dict, Tuple, Optional, Any
import math
from sqlalchemy.orm import Session
import backend.app.models as m
from backend.app.core.config import settings
from backend.app.services.graph_engine import KnowledgeGraphService
from backend.app.services.learner_state import LearnerStateService

class RecommendationPolicy:
    DEFAULT_10FACTOR = "v1.0.0-10factor"
    ACCELERATED_CHALLENGE = "v1.1.0-accelerated_challenge"
    REMEDIAL_RECOVERY = "v1.2.0-remedial_recovery"
    RETENTION_PRIORITY = "v1.3.0-retention_priority"
    LINEAR_BASELINE = "v1.4.0-linear_baseline"

POLICY_REGISTRY: Dict[str, Dict[str, float]] = {
    RecommendationPolicy.DEFAULT_10FACTOR: {
        "W_GOAL": 0.25,
        "W_WEAKNESS": 0.20,
        "W_PREREQ": 0.15,
        "W_RETENTION": 0.15,
        "W_CONTEXT": 0.10,
        "W_SKILL": 0.10,
        "W_CURIOSITY": 0.05
    },
    RecommendationPolicy.ACCELERATED_CHALLENGE: {
        "W_GOAL": 0.35,
        "W_WEAKNESS": 0.30,
        "W_PREREQ": 0.20,
        "W_RETENTION": 0.05,
        "W_CONTEXT": 0.05,
        "W_SKILL": 0.05,
        "W_CURIOSITY": 0.00
    },
    RecommendationPolicy.REMEDIAL_RECOVERY: {
        "W_GOAL": 0.10,
        "W_WEAKNESS": 0.35,
        "W_PREREQ": 0.30,
        "W_RETENTION": 0.10,
        "W_CONTEXT": 0.10,
        "W_SKILL": 0.05,
        "W_CURIOSITY": 0.00
    },
    RecommendationPolicy.RETENTION_PRIORITY: {
        "W_GOAL": 0.15,
        "W_WEAKNESS": 0.15,
        "W_PREREQ": 0.10,
        "W_RETENTION": 0.45,
        "W_CONTEXT": 0.05,
        "W_SKILL": 0.05,
        "W_CURIOSITY": 0.05
    },
    RecommendationPolicy.LINEAR_BASELINE: {
        "W_GOAL": 0.00,
        "W_WEAKNESS": 0.00,
        "W_PREREQ": 1.00,
        "W_RETENTION": 0.00,
        "W_CONTEXT": 0.00,
        "W_SKILL": 0.00,
        "W_CURIOSITY": 0.00
    }
}

class AdaptiveEngineService:
    @staticmethod
    def get_policy_weights(policy_version: str = RecommendationPolicy.DEFAULT_10FACTOR) -> Dict[str, float]:
        return POLICY_REGISTRY.get(policy_version, POLICY_REGISTRY[RecommendationPolicy.DEFAULT_10FACTOR])

    @staticmethod
    def score_candidate(
        db: Session,
        user_id: str,
        concept: m.Concept,
        G: Any,
        goal: Optional[m.Goal] = None,
        current_concept_id: Optional[str] = None,
        policy_version: str = RecommendationPolicy.DEFAULT_10FACTOR
    ) -> Tuple[float, Dict[str, Any]]:
        # 1. Concept State & Weakness Gap
        cs = db.query(m.LearnerConceptState).filter(
            m.LearnerConceptState.user_id == user_id,
            m.LearnerConceptState.concept_id == concept.id
        ).first()

        mastery = cs.mastery if (cs and cs.mastery is not None) else 0.0
        weakness = 1.0 - mastery

        # 2. Goal Relevance
        goal_relevance = 1.0 if (goal and goal.domain_id == concept.domain_id) else 0.7
        if goal and goal.target_concept_ids and concept.id in goal.target_concept_ids:
            goal_relevance = 1.0

        # 3. Downstream Prerequisite Value (centrality in knowledge graph)
        dependents = KnowledgeGraphService.get_dependents(G, concept.id, recursive=True)
        prereq_value = min(1.0, len(dependents) / max(1, len(G.nodes) - 1)) if len(G.nodes) > 1 else 0.5

        # 4. Retention Need (Forgetting Curve)
        retention = LearnerStateService.calculate_retention(
            cs.forgetting_rate if cs else 0.05,
            cs.last_seen if cs else None
        )
        retention_need = 1.0 - retention

        # 5. Context Continuity
        context_continuity = 1.0 if (current_concept_id and current_concept_id == concept.id) else 0.5

        # 6. Skill & Concept Importance
        skill_importance = concept.importance or 0.7

        # 7. Curiosity / Exploration
        exploration = db.query(m.ExplorationItem).filter(
            m.ExplorationItem.user_id == user_id,
            m.ExplorationItem.title.ilike(f"%{concept.name}%")
        ).first()
        curiosity = 0.9 if exploration else 0.2

        # Active Policy Weights
        w = AdaptiveEngineService.get_policy_weights(policy_version)

        # Deterministic Weighted Formula
        total_score = (
            w["W_GOAL"] * goal_relevance +
            w["W_WEAKNESS"] * weakness +
            w["W_PREREQ"] * prereq_value +
            w["W_RETENTION"] * retention_need +
            w["W_CONTEXT"] * context_continuity +
            w["W_SKILL"] * skill_importance +
            w["W_CURIOSITY"] * curiosity
        )

        # Explainable Reason Codes
        reason_codes = []
        if cs is None or cs.mastery is None:
            reason_codes.append("FRONTIER_UNEXPLORED")
        elif cs.mastery < 0.30:
            reason_codes.append("FOUNDATIONAL_GAP")
        elif cs.mastery < 0.70:
            reason_codes.append("WEAKNESS_GAP")

        if retention_need > 0.60:
            reason_codes.append("FORGETTING_RISK")
        if goal_relevance >= 0.90:
            reason_codes.append("GOAL_ALIGNED")
        if prereq_value > 0.30:
            reason_codes.append("PREREQUISITE_GATEWAY")
        if curiosity > 0.50:
            reason_codes.append("CURIOSITY_INTEREST")

        feature_dict = {
            "goal_relevance": round(goal_relevance, 3),
            "weakness": round(weakness, 3),
            "prereq_value": round(prereq_value, 3),
            "retention_need": round(retention_need, 3),
            "context_continuity": round(context_continuity, 3),
            "skill_importance": round(skill_importance, 3),
            "curiosity": round(curiosity, 3),
        }
        factors = {
            "policy_version": policy_version,
            "weights": w,
            "feature_values": feature_dict,
            "reason_codes": reason_codes,
            "composite_score": round(total_score, 4),
            # Flattened for backward compatibility:
            "goal_relevance": round(goal_relevance, 3),
            "weakness": round(weakness, 3),
            "prereq_value": round(prereq_value, 3),
            "retention_need": round(retention_need, 3),
            "context_continuity": round(context_continuity, 3),
            "skill_importance": round(skill_importance, 3),
            "curiosity": round(curiosity, 3),
        }
        return total_score, factors

    @staticmethod
    def select_action(cs: Optional[m.LearnerConceptState]) -> str:
        if not cs or cs.mastery is None or cs.mastery < 0.30:
            return "LEARN"
        if cs.explanation_strength < 0.60:
            return "EXPLAIN"
        if cs.application_strength < 0.60:
            return "PRACTICE"
        if cs.implementation_strength < 0.60:
            return "IMPLEMENT"
        if cs.creation_strength < 0.60:
            return "BUILD"

        now = datetime.now(timezone.utc)
        if cs.review_due and cs.review_due.replace(tzinfo=timezone.utc) <= now:
            return "REVIEW"

        return "ADVANCE"

    @staticmethod
    def calibrate_difficulty(db: Session, user_id: str, concept_id: str, default_diff: float = 0.5) -> float:
        recent_attempts = db.query(m.Attempt).filter(
            m.Attempt.user_id == user_id
        ).order_by(m.Attempt.started_at.desc()).limit(5).all()

        if not recent_attempts:
            return default_diff

        success_count = sum(1 for a in recent_attempts if a.result == "PASS" or a.score >= 0.75)
        success_rate = success_count / len(recent_attempts)

        calibrated = default_diff
        if success_rate > settings.TARGET_SUCCESS_MAX:
            calibrated = min(0.95, default_diff + 0.10)
        elif success_rate < settings.TARGET_SUCCESS_MIN:
            calibrated = max(0.20, default_diff - 0.10)

        return round(calibrated, 2)

    @staticmethod
    def generate_recommendation(
        db: Session,
        user_id: str,
        domain_id: str,
        goal_id: Optional[str] = None,
        session_id: Optional[str] = None,
        policy_version: str = RecommendationPolicy.DEFAULT_10FACTOR
    ) -> Dict[str, Any]:
        G = KnowledgeGraphService.build_domain_graph(db, domain_id)
        frontier = KnowledgeGraphService.get_learning_frontier(db, G, user_id)

        if not frontier:
            frontier = db.query(m.Concept).filter(m.Concept.domain_id == domain_id).all()

        goal = db.query(m.Goal).filter(m.Goal.id == goal_id).first() if goal_id else None

        scored_candidates = []
        for c in frontier:
            score, factors = AdaptiveEngineService.score_candidate(
                db, user_id, c, G, goal=goal, policy_version=policy_version
            )
            scored_candidates.append((c, score, factors))

        scored_candidates.sort(key=lambda x: x[1], reverse=True)
        best_concept, best_score, factors = scored_candidates[0]

        cs = db.query(m.LearnerConceptState).filter(
            m.LearnerConceptState.user_id == user_id,
            m.LearnerConceptState.concept_id == best_concept.id
        ).first()

        action = AdaptiveEngineService.select_action(cs)
        difficulty = AdaptiveEngineService.calibrate_difficulty(
            db, user_id, best_concept.id, best_concept.difficulty or 0.5
        )

        activity = db.query(m.Activity).filter(m.Activity.concept_id == best_concept.id).first()
        activity_type = activity.activity_type if activity else ("EXPLAIN" if action == "EXPLAIN" else "PRACTICE")
        archetype = activity.archetype if activity else ("sequence_engine" if action == "IMPLEMENT" else "causal_graph")
        activity_id = activity.id if activity else None
        data_json = activity.data_json if activity else {}

        # Natural language explainability
        reasons = []
        if not cs or cs.mastery is None:
            reasons.append("Concept is at your current knowledge frontier and all prerequisites are mastered.")
        elif cs.mastery < 0.30:
            reasons.append("Foundational mastery is low; introductory sequence recommended.")
        elif action == "EXPLAIN":
            reasons.append("Explanation and retrieval strength need reinforcement before advanced application.")
        elif action == "PRACTICE":
            reasons.append("Application and problem-solving practice recommended to solidify competence.")
        elif action == "IMPLEMENT":
            reasons.append("Hands-on step-through sequence recommended to test procedural execution.")
        elif action == "REVIEW":
            reasons.append("Spaced review interval due based on Ebbinghaus memory retention curve.")

        if factors["feature_values"]["prereq_value"] > 0.3:
            reasons.append("Mastering this concept unlocks downstream advanced skills in the knowledge graph.")
        if factors["feature_values"]["goal_relevance"] >= 0.9:
            reasons.append("Directly advances your active learning goal.")

        # Persist Recommendation Audit Log for Empirical Experimentation
        audit = m.RecommendationAudit(
            user_id=user_id,
            session_id=session_id,
            domain_id=domain_id,
            concept_id=best_concept.id,
            activity_id=activity_id,
            policy_version=policy_version,
            selected_action=action,
            composite_score=best_score,
            calibrated_difficulty=difficulty,
            feature_values=factors["feature_values"],
            weights=factors["weights"],
            reason_codes=factors["reason_codes"]
        )
        db.add(audit)
        db.commit()

        return {
            "recommendation_id": audit.id,
            "action": action,
            "policy_version": policy_version,
            "feature_values": factors["feature_values"],
            "weights": factors["weights"],
            "final_score": best_score,
            "reason_codes": factors["reason_codes"],
            "target": {
                "type": "concept",
                "id": best_concept.id,
                "name": best_concept.name
            },
            "activity": {
                "type": activity_type,
                "archetype": archetype,
                "difficulty": difficulty,
                "activity_id": activity_id,
                "data_json": data_json
            },
            "estimated_minutes": best_concept.estimated_learning_effort or 20,
            "confidence": 0.92,
            "reasons": reasons,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @staticmethod
    def diagnose_failure_and_repair(
        db: Session,
        user_id: str,
        session_id: Optional[str],
        activity: m.Activity,
        attempt: m.Attempt
    ) -> Tuple[m.FailureEvent, Optional[m.Activity]]:
        category = m.FailureCategory.APPLICATION_FAILURE
        if attempt.error_type:
            err = attempt.error_type.upper()
            if "SYNTAX" in err or "CALCULATION" in err:
                category = m.FailureCategory.EXECUTION_FAILURE
            elif "MISCONCEPTION" in err:
                category = m.FailureCategory.MISCONCEPTION
            elif "FORGOT" in err or "RECALL" in err:
                category = m.FailureCategory.RECALL_FAILURE
            elif "PREREQUISITE" in err:
                category = m.FailureCategory.PREREQUISITE_GAP

        confidence = 0.85 if attempt.score < 0.4 else 0.65
        severity = round(1.0 - (attempt.score or 0.0), 2)

        failure_event = m.FailureEvent(
            session_id=session_id,
            activity_id=activity.id if activity else None,
            attempt_id=attempt.id,
            user_id=user_id,
            concept_id=activity.concept_id if activity else None,
            category=category,
            severity=severity,
            diagnosis_confidence=confidence,
            resolved=False
        )
        db.add(failure_event)
        db.commit()

        repair_activity = None
        if activity and activity.concept_id:
            concept = db.query(m.Concept).filter(m.Concept.id == activity.concept_id).first()
            if concept:
                G = KnowledgeGraphService.build_domain_graph(db, concept.domain_id)
                prereqs = KnowledgeGraphService.get_prerequisites(G, concept.id)
                
                if prereqs:
                    prereq_concept_id = list(prereqs)[0]
                    repair_activity = db.query(m.Activity).filter(
                        m.Activity.concept_id == prereq_concept_id,
                        m.Activity.difficulty <= activity.difficulty
                    ).first()

        return failure_event, repair_activity
