import pytest
import uuid
from datetime import datetime, timezone, timedelta
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.learner_state import LearnerStateService

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_unknown_vs_weak_state(db):
    uid = uuid.uuid4().hex[:8]
    user = m.User(email=f'learner_{uid}@example.com', hashed_password='fake', full_name='Learner Tester')
    db.add(user)
    db.flush()

    domain = m.Domain(name=f'Domain {uid}', slug=f'dom-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    c1 = m.Concept(domain_id=domain.id, name='Unvisited Concept', slug=f'c1-{uid}')
    c2 = m.Concept(domain_id=domain.id, name='Failed Concept', slug=f'c2-{uid}')
    db.add_all([c1, c2])
    db.commit()

    unvisited_state = db.query(m.LearnerConceptState).filter(
        m.LearnerConceptState.user_id == user.id,
        m.LearnerConceptState.concept_id == c1.id
    ).first()
    assert unvisited_state is None

    LearnerStateService.record_evidence(
        db=db,
        user_id=user.id,
        concept_id=c2.id,
        evidence_type=m.EvidenceType.PROBLEM_SOLVING,
        score=0.2,
        quality=1.0
    )

    failed_state = db.query(m.LearnerConceptState).filter(
        m.LearnerConceptState.user_id == user.id,
        m.LearnerConceptState.concept_id == c2.id
    ).first()
    assert failed_state is not None
    assert failed_state.mastery < 0.3
    assert failed_state.failure_count == 1
    assert failed_state.confidence > 0.0

def test_multidimensional_mastery_vector(db):
    uid = uuid.uuid4().hex[:8]
    user = m.User(email=f'vector_{uid}@example.com', hashed_password='fake', full_name='Vector Tester')
    db.add(user)
    db.flush()

    domain = m.Domain(name=f'Vector Dom {uid}', slug=f'vec-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    concept = m.Concept(domain_id=domain.id, name='Vector Concept', slug=f'vec-c-{uid}')
    db.add(concept)
    db.commit()

    LearnerStateService.record_evidence(db, user.id, concept_id=concept.id, evidence_type=m.EvidenceType.RECALL, score=0.9)
    state = db.query(m.LearnerConceptState).filter(m.LearnerConceptState.user_id == user.id, m.LearnerConceptState.concept_id == concept.id).first()
    assert state.recall_strength > 0.0

    LearnerStateService.record_evidence(db, user.id, concept_id=concept.id, evidence_type=m.EvidenceType.PROBLEM_SOLVING, score=0.95)
    db.refresh(state)
    assert state.application_strength > 0.0
    assert state.mastery > state.recall_strength * 0.15

def test_ebbinghaus_retention_decay():
    now = datetime.now(timezone.utc)
    forgetting_rate = 0.05

    r0 = LearnerStateService.calculate_retention(forgetting_rate, now, now)
    assert round(r0, 4) == 1.0

    r14 = LearnerStateService.calculate_retention(forgetting_rate, now - timedelta(days=14), now)
    assert 0.45 < r14 < 0.55

    r60 = LearnerStateService.calculate_retention(forgetting_rate, now - timedelta(days=60), now)
    assert r60 < 0.10

def test_domain_level_progression(db):
    uid = uuid.uuid4().hex[:8]
    user = m.User(email=f'level_{uid}@example.com', hashed_password='fake', full_name='Level Tester')
    db.add(user)
    db.flush()

    domain = m.Domain(name=f'Prog Dom {uid}', slug=f'prog-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    c1 = m.Concept(domain_id=domain.id, name='Progression C1', slug=f'p1-{uid}', importance=1.0)
    c2 = m.Concept(domain_id=domain.id, name='Progression C2', slug=f'p2-{uid}', importance=1.0)
    db.add_all([c1, c2])
    db.commit()

    d_state = LearnerStateService.recompute_domain_state(db, user.id, domain.id)
    assert d_state.level == 'L0'

    for _ in range(3):
        LearnerStateService.record_evidence(db, user.id, concept_id=c1.id, evidence_type=m.EvidenceType.PROBLEM_SOLVING, score=1.0)
        LearnerStateService.record_evidence(db, user.id, concept_id=c1.id, evidence_type=m.EvidenceType.IMPLEMENTATION, score=1.0)
        LearnerStateService.record_evidence(db, user.id, concept_id=c2.id, evidence_type=m.EvidenceType.PROBLEM_SOLVING, score=1.0)
        LearnerStateService.record_evidence(db, user.id, concept_id=c2.id, evidence_type=m.EvidenceType.IMPLEMENTATION, score=1.0)

    db.refresh(d_state)
    assert d_state.overall_mastery > 0.35
    assert d_state.level in ['L2', 'L3', 'L4', 'L5', 'L6']
