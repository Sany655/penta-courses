from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import backend.app.models as m
from backend.app.services.graph_engine import KnowledgeGraphService

class CuriosityEngineService:
    @staticmethod
    def capture_curiosity_signal(
        db: Session,
        user_id: str,
        title: str,
        domain: Optional[str] = None,
        reason: Optional[str] = None,
        interest_score: float = 0.6
    ) -> m.ExplorationItem:
        existing = db.query(m.ExplorationItem).filter(
            m.ExplorationItem.user_id == user_id,
            m.ExplorationItem.title.ilike(title.strip())
        ).first()

        now = datetime.now(timezone.utc)
        if existing:
            existing.times_mentioned += 1
            existing.times_revisited += 1
            existing.interest_score = min(1.0, existing.interest_score + 0.15)
            existing.last_revisited = now
            if reason and not existing.reason:
                existing.reason = reason
            db.commit()
            db.refresh(existing)
            return existing

        item = m.ExplorationItem(
            user_id=user_id,
            title=title.strip(),
            domain=domain,
            reason=reason,
            interest_score=interest_score,
            status='CAPTURED',
            created_at=now,
            last_revisited=now
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def list_exploration_radar(db: Session, user_id: str) -> List[m.ExplorationItem]:
        return db.query(m.ExplorationItem).filter(
            m.ExplorationItem.user_id == user_id
        ).order_by(m.ExplorationItem.interest_score.desc()).all()

    @staticmethod
    def promote_exploration_to_goal(db: Session, user_id: str, item_id: str) -> m.Goal:
        item = db.query(m.ExplorationItem).filter(
            m.ExplorationItem.id == item_id,
            m.ExplorationItem.user_id == user_id
        ).first()
        if not item:
            raise ValueError("Exploration item not found")

        # Find matching domain
        domain = None
        if item.domain:
            domain = db.query(m.Domain).filter(
                (m.Domain.name.ilike(f"%{item.domain}%")) | (m.Domain.slug.ilike(f"%{item.domain}%"))
            ).first()
        if not domain:
            domain = db.query(m.Domain).first()

        goal = m.Goal(
            user_id=user_id,
            domain_id=domain.id if domain else None,
            title=f"Master: {item.title}",
            description=item.reason or f"Promoted from exploration radar: {item.title}",
            goal_type=m.GoalType.EXPLORATION,
            target_level='L3',
            priority=1
        )
        db.add(goal)

        item.status = 'PROMOTED'
        item.last_revisited = datetime.now(timezone.utc)
        db.commit()
        db.refresh(goal)
        return goal

    @staticmethod
    def generate_tangent_missions(
        db: Session,
        user_id: str,
        domain_id: str,
        current_concept_id: str
    ) -> List[Dict[str, Any]]:
        G = KnowledgeGraphService.build_domain_graph(db, domain_id)
        if current_concept_id not in G:
            return []

        # Find direct neighbors in knowledge graph (outgoing + incoming)
        neighbors = set(G.successors(current_concept_id)) | set(G.predecessors(current_concept_id))
        if not neighbors:
            return []

        concepts = db.query(m.Concept).filter(m.Concept.id.in_(neighbors)).all()
        tangents = []

        for c in concepts:
            tangents.append({
                'concept_id': c.id,
                'name': c.name,
                'type': c.type,
                'difficulty': c.difficulty,
                'rationale': f"Tangentially connects to current focus via domain conceptual architecture."
            })
        return tangents
