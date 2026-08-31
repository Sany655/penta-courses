from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import backend.app.models as m
from backend.app.services.graph_engine import KnowledgeGraphService

class AdminService:
    @staticmethod
    def get_system_overview_stats(db: Session) -> Dict[str, Any]:
        user_count = db.query(m.User).count()
        domain_count = db.query(m.Domain).count()
        concept_count = db.query(m.Concept).count()
        activity_count = db.query(m.Activity).count()
        evidence_count = db.query(m.LearningEvidence).count()
        course_count = db.query(m.Course).count()
        bypass_count = db.query(m.ModuleBypass).count()

        return {
            'total_users': user_count,
            'total_domains': domain_count,
            'total_concepts': concept_count,
            'total_activities': activity_count,
            'total_evidence_records': evidence_count,
            'total_courses': course_count,
            'total_module_bypasses': bypass_count
        }

    @staticmethod
    def create_or_update_domain(
        db: Session,
        admin_id: str,
        name: str,
        slug: str,
        description: Optional[str] = None,
        difficulty: float = 0.5,
        status: str = 'PUBLISHED'
    ) -> m.Domain:
        domain = db.query(m.Domain).filter((m.Domain.slug == slug) | (m.Domain.name == name)).first()
        if not domain:
            domain = m.Domain(
                name=name,
                slug=slug,
                description=description,
                difficulty=difficulty,
                status=status
            )
            db.add(domain)
        else:
            domain.name = name
            domain.slug = slug
            domain.description = description
            domain.difficulty = difficulty
            domain.status = status

        # Log admin audit
        audit = m.AdminAuditLog(
            admin_id=admin_id,
            action='UPSERT_DOMAIN',
            entity_type='DOMAIN',
            entity_id=domain.id,
            details_json={'name': name, 'slug': slug, 'status': status}
        )
        db.add(audit)
        db.commit()
        db.refresh(domain)
        return domain

    @staticmethod
    def create_or_update_concept(
        db: Session,
        admin_id: str,
        domain_id: str,
        name: str,
        slug: str,
        concept_type: str = 'CONCEPT',
        difficulty: float = 0.5,
        importance: float = 1.0,
        estimated_learning_effort: int = 20
    ) -> m.Concept:
        concept = db.query(m.Concept).filter(
            m.Concept.domain_id == domain_id,
            (m.Concept.slug == slug) | (m.Concept.name == name)
        ).first()

        if not concept:
            concept = m.Concept(
                domain_id=domain_id,
                name=name,
                slug=slug,
                type=concept_type,
                difficulty=difficulty,
                importance=importance,
                estimated_learning_effort=estimated_learning_effort
            )
            db.add(concept)
        else:
            concept.name = name
            concept.type = concept_type
            concept.difficulty = difficulty
            concept.importance = importance
            concept.estimated_learning_effort = estimated_learning_effort

        audit = m.AdminAuditLog(
            admin_id=admin_id,
            action='UPSERT_CONCEPT',
            entity_type='CONCEPT',
            entity_id=concept.id,
            details_json={'name': name, 'domain_id': domain_id}
        )
        db.add(audit)
        db.commit()
        db.refresh(concept)
        return concept

    @staticmethod
    def add_concept_relation(
        db: Session,
        admin_id: str,
        domain_id: str,
        from_concept_id: str,
        to_concept_id: str,
        relation_type: str = 'REQUIRED_PREREQUISITE'
    ) -> m.ConceptRelation:
        # Validate cycle creation
        G = KnowledgeGraphService.build_domain_graph(db, domain_id)
        G.add_edge(from_concept_id, to_concept_id)
        
        is_acyclic, cycles = KnowledgeGraphService.validate_graph_acyclic(G)
        if not is_acyclic:
            raise ValueError(f"Adding this edge creates a cycle in the DAG: {cycles}")

        rel = db.query(m.ConceptRelation).filter(
            m.ConceptRelation.from_concept_id == from_concept_id,
            m.ConceptRelation.to_concept_id == to_concept_id
        ).first()

        if not rel:
            rel = m.ConceptRelation(
                from_concept_id=from_concept_id,
                to_concept_id=to_concept_id,
                relation_type=relation_type
            )
            db.add(rel)

        audit = m.AdminAuditLog(
            admin_id=admin_id,
            action='ADD_RELATION',
            entity_type='CONCEPT_RELATION',
            entity_id=rel.id,
            details_json={'from': from_concept_id, 'to': to_concept_id, 'type': relation_type}
        )
        db.add(audit)
        db.commit()
        db.refresh(rel)
        return rel

    @staticmethod
    def override_learner_mastery(
        db: Session,
        admin_id: str,
        user_id: str,
        concept_id: str,
        mastery_value: float,
        reason: Optional[str] = None
    ) -> m.LearnerConceptState:
        state = db.query(m.LearnerConceptState).filter(
            m.LearnerConceptState.user_id == user_id,
            m.LearnerConceptState.concept_id == concept_id
        ).first()

        if not state:
            state = m.LearnerConceptState(
                user_id=user_id,
                concept_id=concept_id,
                mastery=mastery_value,
                confidence=1.0,
                recall_strength=mastery_value,
                explanation_strength=mastery_value,
                application_strength=mastery_value,
                implementation_strength=mastery_value,
                creation_strength=mastery_value,
                first_seen=datetime.now(timezone.utc),
                last_seen=datetime.now(timezone.utc),
                last_success=datetime.now(timezone.utc)
            )
            db.add(state)
        else:
            state.mastery = mastery_value
            state.confidence = 1.0
            state.recall_strength = mastery_value
            state.explanation_strength = mastery_value
            state.application_strength = mastery_value
            state.implementation_strength = mastery_value
            state.creation_strength = mastery_value
            state.last_seen = datetime.now(timezone.utc)

        audit = m.AdminAuditLog(
            admin_id=admin_id,
            action='OVERRIDE_MASTERY',
            entity_type='LEARNER_STATE',
            entity_id=state.id,
            details_json={'user_id': user_id, 'concept_id': concept_id, 'mastery': mastery_value, 'reason': reason}
        )
        db.add(audit)
        db.commit()
        db.refresh(state)
        return state

    @staticmethod
    def update_pricing_and_bypasses(
        db: Session,
        admin_id: str,
        course_id: Optional[str] = None,
        module_id: Optional[str] = None,
        price_in_cents: Optional[int] = None,
        bypass_fee_in_cents: Optional[int] = None
    ) -> Dict[str, Any]:
        result = {}
        if course_id and price_in_cents is not None:
            course = db.query(m.Course).filter(m.Course.id == course_id).first()
            if course:
                course.price_in_cents = price_in_cents
                result['course_id'] = course.id
                result['new_course_price'] = price_in_cents

        if module_id and bypass_fee_in_cents is not None:
            mod = db.query(m.Module).filter(m.Module.id == module_id).first()
            if mod:
                mod.bypass_fee_in_cents = bypass_fee_in_cents
                result['module_id'] = mod.id
                result['new_bypass_fee'] = bypass_fee_in_cents

        audit = m.AdminAuditLog(
            admin_id=admin_id,
            action='UPDATE_PRICING',
            entity_type='COMMERCE',
            entity_id=course_id or module_id,
            details_json=result
        )
        db.add(audit)
        db.commit()
        return result
