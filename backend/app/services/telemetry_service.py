from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
import backend.app.models as m

class TelemetryService:
    @staticmethod
    def record_event(
        db: Session,
        user_id: str,
        event_type: str,
        session_id: Optional[str] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        payload: Optional[Dict[str, Any]] = None
    ) -> m.LearningEvent:
        event = m.LearningEvent(
            user_id=user_id,
            session_id=session_id,
            event_type=event_type,
            entity_type=entity_type or 'ACTIVITY',
            entity_id=entity_id or 'global',
            payload_json=payload or {},
            timestamp=datetime.now(timezone.utc)
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def get_learner_telemetry_summary(db: Session, user_id: str) -> Dict[str, Any]:
        total_events = db.query(m.LearningEvent).filter(m.LearningEvent.user_id == user_id).count()
        attempts = db.query(m.Attempt).filter(m.Attempt.user_id == user_id).all()
        
        success_count = sum(1 for a in attempts if a.result == 'PASS' or a.score >= 0.7)
        total_attempts = len(attempts)
        accuracy = (success_count / total_attempts) if total_attempts > 0 else 0.0

        failures = db.query(m.FailureEvent).join(m.Attempt).filter(m.Attempt.user_id == user_id).all()
        failure_dist = {}
        for f in failures:
            failure_dist[f.category] = failure_dist.get(f.category, 0) + 1

        return {
            'user_id': user_id,
            'total_events_logged': total_events,
            'total_attempts': total_attempts,
            'success_rate': round(accuracy, 2),
            'failure_taxonomy_distribution': failure_dist
        }
