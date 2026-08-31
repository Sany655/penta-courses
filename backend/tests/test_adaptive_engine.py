import pytest
import uuid
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.graph_engine import KnowledgeGraphService
from backend.app.services.learner_state import LearnerStateService
from backend.app.services.adaptive_engine import AdaptiveEngineService

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_candidate_scoring_and_action_selection(db):
    uid = uuid.uuid4().hex[:8]
    user = m.User(email=f'adaptive_{uid}@example.com', hashed_password='fake', full_name='Adaptive Tester')
    db.add(user)
    db.flush()

    domain = m.Domain(name=f'Adaptive Dom {uid}', slug=f'adom-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    c1 = m.Concept(domain_id=domain.id, name='Concept 1', slug=f'c1-{uid}', difficulty=0.6, importance=0.9)
    db.add(c1)
    db.commit()

    G = KnowledgeGraphService.build_domain_graph(db, domain.id)

    # Initial score (unvisited concept)
    score, factors = AdaptiveEngineService.score_candidate(db, user.id, c1, G)
    assert score > 0.3
    assert factors['weakness'] == 1.0

    # Action selection for unvisited -> LEARN
    cs = db.query(m.LearnerConceptState).filter(m.LearnerConceptState.user_id == user.id, m.LearnerConceptState.concept_id == c1.id).first()
    action = AdaptiveEngineService.select_action(cs)
    assert action == 'LEARN'

    # Once explanation is weak -> EXPLAIN
    LearnerStateService.record_evidence(db, user.id, concept_id=c1.id, evidence_type=m.EvidenceType.RECALL, score=0.8)
    cs = db.query(m.LearnerConceptState).filter(m.LearnerConceptState.user_id == user.id, m.LearnerConceptState.concept_id == c1.id).first()
    cs.mastery = 0.4
    cs.explanation_strength = 0.2
    assert AdaptiveEngineService.select_action(cs) == 'EXPLAIN'

def test_generate_explainable_recommendation(db):
    uid = uuid.uuid4().hex[:8]
    user = m.User(email=f'rec_{uid}@example.com', hashed_password='fake', full_name='Rec Tester')
    db.add(user)
    db.flush()

    domain = m.Domain(name=f'Rec Dom {uid}', slug=f'rdom-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    c_root = m.Concept(domain_id=domain.id, name='Root Concept', slug=f'rroot-{uid}', importance=1.0)
    db.add(c_root)
    db.flush()

    activity = m.Activity(
        concept_id=c_root.id,
        title='Root Activity',
        activity_type='PRACTICE',
        archetype='sequence_engine',
        difficulty=0.5
    )
    db.add(activity)
    db.commit()

    rec = AdaptiveEngineService.generate_recommendation(db, user.id, domain.id)
    assert rec['action'] == 'LEARN'
    assert rec['target']['id'] == c_root.id
    assert rec['activity']['archetype'] == 'sequence_engine'
    assert len(rec['reasons']) >= 1
    assert 'prerequisites' in rec['reasons'][0].lower() or 'frontier' in rec['reasons'][0].lower()

def test_failure_diagnosis_and_prerequisite_repair(db):
    uid = uuid.uuid4().hex[:8]
    user = m.User(email=f'repair_{uid}@example.com', hashed_password='fake', full_name='Repair Tester')
    db.add(user)
    db.flush()

    domain = m.Domain(name=f'Repair Dom {uid}', slug=f'repdom-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    c_base = m.Concept(domain_id=domain.id, name='Base Prereq', slug=f'base-{uid}')
    c_adv = m.Concept(domain_id=domain.id, name='Advanced Target', slug=f'adv-{uid}')
    db.add_all([c_base, c_adv])
    db.flush()

    db.add(m.ConceptRelation(from_concept_id=c_base.id, to_concept_id=c_adv.id, relation_type='REQUIRED_PREREQUISITE'))

    a_base = m.Activity(concept_id=c_base.id, title='Base Activity', activity_type='PRACTICE', archetype='causal_graph')
    a_adv = m.Activity(concept_id=c_adv.id, title='Adv Activity', activity_type='PRACTICE', archetype='sequence_engine')
    db.add_all([a_base, a_adv])
    db.flush()

    session = m.LearningSession(user_id=user.id, domain_id=domain.id)
    db.add(session)
    db.flush()

    attempt = m.Attempt(
        session_id=session.id,
        activity_id=a_adv.id,
        user_id=user.id,
        result='FAIL',
        score=0.2,
        error_type='PREREQUISITE_DEFICIT'
    )
    db.add(attempt)
    db.commit()

    failure_event, repair_act = AdaptiveEngineService.diagnose_failure_and_repair(
        db, user.id, session.id, a_adv, attempt
    )
    assert failure_event.category == m.FailureCategory.PREREQUISITE_GAP
    assert repair_act is not None
    assert repair_act.concept_id == c_base.id  # Successfully targeted the missing prerequisite!
