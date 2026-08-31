from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import backend.app.models as m
from backend.app.services.learner_state import LearnerStateService

class SyncService:
    @staticmethod
    def push_offline_events(
        db: Session,
        user_id: str,
        device_id: str,
        events: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Processes a batch of offline outbox events from a client device (SQLite/Tauri/Mobile).
        """
        processed_count = 0
        duplicate_count = 0

        for ev in events:
            ev_id = ev.get("id")
            ev_type = ev.get("event_type", "BLOCK_INTERACTION")
            session_id = ev.get("session_id")
            entity_type = ev.get("entity_type", "CONCEPT")
            entity_id = ev.get("entity_id")
            payload = ev.get("payload", {})
            ts_str = ev.get("timestamp")
            
            try:
                ev_time = datetime.fromisoformat(ts_str) if ts_str else datetime.now(timezone.utc)
            except Exception:
                ev_time = datetime.now(timezone.utc)

            # Deduplication: Check if event with same device_id & timestamp or entity exists
            existing = db.query(m.LearningEvent).filter(
                m.LearningEvent.user_id == user_id,
                m.LearningEvent.device_id == device_id,
                m.LearningEvent.event_type == ev_type,
                m.LearningEvent.entity_id == entity_id,
                m.LearningEvent.timestamp == ev_time
            ).first()

            if existing:
                duplicate_count += 1
                continue

            event_record = m.LearningEvent(
                user_id=user_id,
                session_id=session_id,
                event_type=ev_type,
                entity_type=entity_type,
                entity_id=entity_id,
                payload_json=payload,
                device_id=device_id,
                timestamp=ev_time
            )
            db.add(event_record)
            processed_count += 1

            # If the event is an attempt completion, update learner state
            if ev_type in ["ACTIVITY_COMPLETED", "ACTIVITY_FAILED"] and entity_id:
                score = payload.get("score", 1.0 if ev_type == "ACTIVITY_COMPLETED" else 0.3)
                evidence_type = payload.get("evidence_type", m.EvidenceType.PROBLEM_SOLVING)
                time_taken = payload.get("time_taken_seconds", 30)

                LearnerStateService.record_evidence(
                    db=db,
                    user_id=user_id,
                    concept_id=entity_id if entity_type == "CONCEPT" else None,
                    evidence_type=evidence_type,
                    score=score,
                    time_taken=time_taken,
                    telemetry_json=payload.get("telemetry", {})
                )

        db.commit()
        return {
            "status": "SYNCED",
            "processed_count": processed_count,
            "duplicate_count": duplicate_count,
            "server_timestamp": datetime.now(timezone.utc).isoformat()
        }

    @staticmethod
    def pull_state_delta(
        db: Session,
        user_id: str,
        since_timestamp: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Returns delta learner states, goals, and active entitlements updated since timestamp.
        """
        query = db.query(m.LearnerConceptState).filter(m.LearnerConceptState.user_id == user_id)
        if since_timestamp:
            try:
                dt = datetime.fromisoformat(since_timestamp)
                query = query.filter(m.LearnerConceptState.updated_at >= dt)
            except Exception:
                pass

        states = query.all()
        entitlements = db.query(m.Entitlement).filter(
            m.Entitlement.user_id == user_id,
            m.Entitlement.is_active == True
        ).all()
        goals = db.query(m.Goal).filter(m.Goal.user_id == user_id).all()

        return {
            "server_timestamp": datetime.now(timezone.utc).isoformat(),
            "concept_states": [
                {
                    "concept_id": s.concept_id,
                    "mastery": s.mastery,
                    "recall_strength": s.recall_strength,
                    "explanation_strength": s.explanation_strength,
                    "application_strength": s.application_strength,
                    "implementation_strength": s.implementation_strength,
                    "creation_strength": s.creation_strength,
                    "review_due": s.review_due.isoformat() if s.review_due else None,
                    "updated_at": s.updated_at.isoformat() if s.updated_at else None
                }
                for s in states
            ],
            "active_entitlements": [
                {"item_type": e.item_type, "item_id": e.item_id, "granted_at": e.granted_at.isoformat() if e.granted_at else None}
                for e in entitlements
            ],
            "goals": [
                {"id": g.id, "title": g.title, "status": g.status, "progress": g.progress}
                for g in goals
            ]
        }
