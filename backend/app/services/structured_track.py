from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import backend.app.models as m
from backend.app.services.learner_state import LearnerStateService

class StructuredTrackService:
    @staticmethod
    def get_course_structure_with_mastery(
        db: Session,
        user_id: str,
        course_id: str
    ) -> Dict[str, Any]:
        course = db.query(m.Course).filter(m.Course.id == course_id).first()
        if not course:
            raise ValueError("Course not found")

        modules = db.query(m.Module).filter(
            m.Module.course_id == course_id
        ).order_by(m.Module.order_index.asc()).all()

        bypasses = db.query(m.ModuleBypass).filter(
            m.ModuleBypass.user_id == user_id
        ).all()
        bypassed_module_ids = {b.module_id for b in bypasses}

        # Concept masteries for user
        concept_states = {
            cs.concept_id: cs.mastery
            for cs in db.query(m.LearnerConceptState).filter(m.LearnerConceptState.user_id == user_id).all()
        }

        previous_module_completed = True
        module_list = []

        for mod in modules:
            is_bypassed = mod.id in bypassed_module_ids
            lessons = db.query(m.Lesson).filter(
                m.Lesson.module_id == mod.id
            ).order_by(m.Lesson.order_index.asc()).all()

            lesson_list = []
            mod_concepts = []
            for les in lessons:
                m_score = concept_states.get(les.concept_id) if les.concept_id else None
                if les.concept_id:
                    mod_concepts.append(m_score if m_score is not None else 0.0)
                lesson_list.append({
                    'id': les.id,
                    'title': les.title,
                    'order_index': les.order_index,
                    'concept_id': les.concept_id,
                    'mastery': m_score,
                    'is_completed': m_score is not None and m_score >= 0.70
                })

            avg_mastery = (sum(mod_concepts) / max(1, len(mod_concepts))) if mod_concepts else 0.0
            is_completed = is_bypassed or (len(mod_concepts) > 0 and all(c >= 0.70 for c in mod_concepts))
            is_locked = not previous_module_completed and not is_bypassed

            module_list.append({
                'id': mod.id,
                'title': mod.title,
                'order_index': mod.order_index,
                'is_locked': is_locked,
                'is_bypassed': is_bypassed,
                'is_completed': is_completed,
                'average_mastery': round(avg_mastery, 2),
                'bypass_fee': getattr(mod, 'bypass_fee_in_cents', 299) / 100.0,
                'lessons': lesson_list
            })

            previous_module_completed = is_completed

        return {
            'course_id': course.id,
            'title': course.title,
            'domain_id': course.domain_id,
            'modules': module_list
        }

    @staticmethod
    def evaluate_module_bypass_exam(
        db: Session,
        user_id: str,
        module_id: str,
        responses: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        module = db.query(m.Module).filter(m.Module.id == module_id).first()
        if not module:
            raise ValueError("Module not found")

        # Score responses
        total_score = 0.0
        for r in responses:
            total_score += float(r.get('score', 0.8))
        avg_score = total_score / max(1, len(responses))

        passing_threshold = getattr(module, 'bypass_exam_passing_score', 0.80) or 0.80
        passed = avg_score >= passing_threshold

        if passed:
            # Create Bypass record
            bypass = m.ModuleBypass(
                user_id=user_id,
                module_id=module.id,
                bypass_type='EXAM_PASSED',
                score=avg_score,
                unlocked_at=datetime.now(timezone.utc)
            )
            db.add(bypass)

            # Fast-track all concept states in module lessons
            lessons = db.query(m.Lesson).filter(m.Lesson.module_id == module.id).all()
            for les in lessons:
                if les.concept_id:
                    LearnerStateService.record_diagnostic_mastery(
                        db, user_id, les.concept_id, mastery_level=max(0.85, avg_score)
                    )
            db.commit()

        return {
            'module_id': module.id,
            'passed': passed,
            'score': round(avg_score, 2),
            'passing_threshold': passing_threshold,
            'status': 'UNLOCKED' if passed else 'FAILED'
        }

    @staticmethod
    def record_paid_bypass(
        db: Session,
        user_id: str,
        module_id: str,
        transaction_id: Optional[str] = None
    ) -> m.ModuleBypass:
        module = db.query(m.Module).filter(m.Module.id == module_id).first()
        if not module:
            raise ValueError("Module not found")

        bypass = m.ModuleBypass(
            user_id=user_id,
            module_id=module.id,
            bypass_type='PAID_BYPASS',
            score=1.0,
            transaction_id=transaction_id,
            unlocked_at=datetime.now(timezone.utc)
        )
        db.add(bypass)
        db.commit()
        db.refresh(bypass)
        return bypass
