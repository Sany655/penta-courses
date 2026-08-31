from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any, List
import math
from sqlalchemy.orm import Session
import backend.app.models as m

class LearnerStateService:
    @staticmethod
    def calculate_retention(forgetting_rate: float, last_seen: Optional[datetime], current_time: Optional[datetime] = None) -> float:
        if not last_seen:
            return 0.0
        now = current_time or datetime.now(timezone.utc)
        if last_seen.tzinfo is None:
            last_seen = last_seen.replace(tzinfo=timezone.utc)
        if now.tzinfo is None:
            now = now.replace(tzinfo=timezone.utc)
        
        delta_days = max(0.0, (now - last_seen).total_seconds() / 86400.0)
        retention = math.exp(-forgetting_rate * delta_days)
        return max(0.0, min(1.0, retention))

    @staticmethod
    def record_diagnostic_mastery(
        db: Session,
        user_id: str,
        concept_id: str,
        mastery_level: float = 0.85,
        confidence: float = 0.9
    ) -> m.LearnerConceptState:
        # Fast-track diagnostic probe mastery
        now = datetime.now(timezone.utc)
        state = db.query(m.LearnerConceptState).filter(
            m.LearnerConceptState.user_id == user_id,
            m.LearnerConceptState.concept_id == concept_id
        ).first()

        if not state:
            state = m.LearnerConceptState(
                user_id=user_id,
                concept_id=concept_id,
                first_seen=now,
                forgetting_rate=0.04
            )
            db.add(state)

        state.last_seen = now
        state.attempt_count = (state.attempt_count or 0) + 1
        state.success_count = (state.success_count or 0) + 1
        state.last_success = now

        state.recall_strength = mastery_level
        state.explanation_strength = mastery_level
        state.application_strength = mastery_level
        state.implementation_strength = mastery_level
        state.creation_strength = mastery_level
        state.mastery = mastery_level
        state.confidence = confidence

        state.review_due = now + timedelta(days=21)
        state.updated_at = now

        concept = db.query(m.Concept).filter(m.Concept.id == concept_id).first()
        if concept:
            LearnerStateService.recompute_domain_state(db, user_id, concept.domain_id)

        db.commit()
        db.refresh(state)
        return state

    @staticmethod
    def record_evidence(
        db: Session,
        user_id: str,
        concept_id: Optional[str] = None,
        skill_id: Optional[str] = None,
        activity_id: Optional[str] = None,
        session_id: Optional[str] = None,
        attempt_id: Optional[str] = None,
        evidence_type: str = m.EvidenceType.PROBLEM_SOLVING,
        score: float = 1.0,
        quality: float = 1.0,
        confidence_reported: float = 0.8,
        time_taken: int = 30,
        telemetry_json: Optional[Dict[str, Any]] = None
    ) -> m.LearningEvidence:
        now = datetime.now(timezone.utc)
        telemetry = telemetry_json or {}

        evidence = m.LearningEvidence(
            user_id=user_id,
            concept_id=concept_id,
            skill_id=skill_id,
            activity_id=activity_id,
            session_id=session_id,
            attempt_id=attempt_id,
            evidence_type=evidence_type,
            score=max(0.0, min(1.0, score)),
            quality=max(0.0, min(1.0, quality)),
            confidence_reported=confidence_reported,
            time_taken=time_taken,
            telemetry_json=telemetry,
            created_at=now
        )
        db.add(evidence)

        event = m.LearningEvent(
            user_id=user_id,
            session_id=session_id,
            event_type=m.EventType.ACTIVITY_COMPLETED if score >= 0.7 else m.EventType.ACTIVITY_FAILED,
            entity_type='CONCEPT' if concept_id else ('SKILL' if skill_id else 'ACTIVITY'),
            entity_id=concept_id or skill_id or activity_id or 'unknown',
            payload_json={'score': score, 'evidence_type': evidence_type},
            timestamp=now
        )
        db.add(event)

        if concept_id:
            state = db.query(m.LearnerConceptState).filter(
                m.LearnerConceptState.user_id == user_id,
                m.LearnerConceptState.concept_id == concept_id
            ).first()

            if not state:
                state = m.LearnerConceptState(
                    user_id=user_id,
                    concept_id=concept_id,
                    first_seen=now,
                    forgetting_rate=0.05,
                    recall_strength=0.0,
                    explanation_strength=0.0,
                    application_strength=0.0,
                    implementation_strength=0.0,
                    creation_strength=0.0,
                    attempt_count=0,
                    success_count=0,
                    failure_count=0,
                    confidence=0.0
                )
                db.add(state)

            state.last_seen = now
            state.attempt_count = (state.attempt_count or 0) + 1
            if score >= 0.7:
                state.success_count = (state.success_count or 0) + 1
                state.last_success = now
            else:
                state.failure_count = (state.failure_count or 0) + 1
                state.last_failure = now

            alpha = 0.35
            weighted_score = score * quality

            if evidence_type == m.EvidenceType.RECALL:
                state.recall_strength = (1 - alpha) * (state.recall_strength or 0.0) + alpha * weighted_score
            elif evidence_type in [m.EvidenceType.EXPLANATION, m.EvidenceType.TEACHING]:
                state.explanation_strength = (1 - alpha) * (state.explanation_strength or 0.0) + alpha * weighted_score
            elif evidence_type in [m.EvidenceType.PROBLEM_SOLVING, m.EvidenceType.DEBUGGING]:
                state.application_strength = (1 - alpha) * (state.application_strength or 0.0) + alpha * weighted_score
            elif evidence_type in [m.EvidenceType.IMPLEMENTATION, m.EvidenceType.TRANSFER]:
                state.implementation_strength = (1 - alpha) * (state.implementation_strength or 0.0) + alpha * weighted_score
            elif evidence_type == m.EvidenceType.PROJECT:
                state.creation_strength = (1 - alpha) * (state.creation_strength or 0.0) + alpha * weighted_score

            state.mastery = (
                0.15 * (state.recall_strength or 0.0) +
                0.20 * (state.explanation_strength or 0.0) +
                0.35 * (state.application_strength or 0.0) +
                0.20 * (state.implementation_strength or 0.0) +
                0.10 * (state.creation_strength or 0.0)
            )

            evidence_count = state.attempt_count or 1
            state.confidence = min(0.98, 0.25 * math.log(evidence_count + 1) + 0.3 * ((state.success_count or 0) / max(1, state.attempt_count or 1)))

            stability_days = max(1.0, (1.0 / (state.forgetting_rate or 0.05)) * ((state.mastery or 0.1) ** 1.5))
            state.review_due = now + timedelta(days=stability_days)
            state.updated_at = now

            concept = db.query(m.Concept).filter(m.Concept.id == concept_id).first()
            if concept:
                LearnerStateService.recompute_domain_state(db, user_id, concept.domain_id)

        if skill_id:
            s_state = db.query(m.LearnerSkillState).filter(
                m.LearnerSkillState.user_id == user_id,
                m.LearnerSkillState.skill_id == skill_id
            ).first()
            if not s_state:
                s_state = m.LearnerSkillState(
                    user_id=user_id,
                    skill_id=skill_id,
                    attempt_count=0,
                    success_count=0,
                    failure_count=0,
                    mastery=0.0,
                    confidence=0.0
                )
                db.add(s_state)
            
            s_state.attempt_count = (s_state.attempt_count or 0) + 1
            if score >= 0.7:
                s_state.success_count = (s_state.success_count or 0) + 1
                s_state.last_success = now
            else:
                s_state.failure_count = (s_state.failure_count or 0) + 1
                s_state.last_failure = now
            
            s_state.mastery = (0.7 * (s_state.mastery or 0.0)) + (0.3 * score)
            s_state.confidence = min(0.95, 0.3 * math.log(s_state.attempt_count + 1))
            s_state.updated_at = now

        db.commit()
        db.refresh(evidence)
        return evidence

    @staticmethod
    def recompute_domain_state(db: Session, user_id: str, domain_id: str) -> m.LearnerDomainState:
        domain_state = db.query(m.LearnerDomainState).filter(
            m.LearnerDomainState.user_id == user_id,
            m.LearnerDomainState.domain_id == domain_id
        ).first()

        if not domain_state:
            domain_state = m.LearnerDomainState(user_id=user_id, domain_id=domain_id)
            db.add(domain_state)

        domain_concepts = db.query(m.Concept).filter(m.Concept.domain_id == domain_id).all()
        if not domain_concepts:
            return domain_state

        concept_ids = [c.id for c in domain_concepts]
        concept_states = db.query(m.LearnerConceptState).filter(
            m.LearnerConceptState.user_id == user_id,
            m.LearnerConceptState.concept_id.in_(concept_ids)
        ).all()

        state_by_id = {cs.concept_id: cs for cs in concept_states}
        
        total_weight = 0.0
        weighted_mastery_sum = 0.0
        known_count = 0

        for c in domain_concepts:
            cs = state_by_id.get(c.id)
            w = c.importance or 1.0
            total_weight += w
            if cs and cs.mastery is not None:
                weighted_mastery_sum += cs.mastery * w
                known_count += 1

        overall_mastery = (weighted_mastery_sum / total_weight) if total_weight > 0 else 0.0
        domain_state.overall_mastery = round(overall_mastery, 4)
        domain_state.confidence = min(1.0, known_count / max(1, len(domain_concepts)))

        ratio = overall_mastery
        if ratio < 0.15:
            domain_state.level = 'L0'
        elif ratio < 0.35:
            domain_state.level = 'L1'
        elif ratio < 0.55:
            domain_state.level = 'L2'
        elif ratio < 0.70:
            domain_state.level = 'L3'
        elif ratio < 0.85:
            domain_state.level = 'L4'
        elif ratio < 0.95:
            domain_state.level = 'L5'
        else:
            domain_state.level = 'L6'

        domain_state.last_active = datetime.now(timezone.utc)
        return domain_state
