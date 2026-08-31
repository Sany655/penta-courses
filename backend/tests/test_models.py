import pytest
import uuid
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.core.security import get_password_hash, verify_password

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_password_hashing():
    pwd = 'SecurePassword2026!'
    hashed = get_password_hash(pwd)
    assert verify_password(pwd, hashed) is True
    assert verify_password('WrongPassword', hashed) is False

def test_user_and_profile_creation(db):
    uid = uuid.uuid4().hex[:8]
    email = f'test_user_{uid}@example.com'
    user = m.User(
        email=email,
        hashed_password=get_password_hash('testpass123'),
        full_name='Phase1 Tester',
        role=m.UserRole.STUDENT
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    profile = m.LearnerProfile(
        user_id=user.id,
        learning_mode='STRUCTURED',
        challenge_preference=0.8
    )
    db.add(profile)
    db.commit()

    queried_user = db.query(m.User).filter(m.User.email == email).first()
    assert queried_user is not None
    assert queried_user.profile.learning_mode == 'STRUCTURED'

def test_domain_knowledge_graph_model(db):
    uid = uuid.uuid4().hex[:8]
    domain = m.Domain(
        name=f'Test Domain {uid}',
        slug=f'test-domain-{uid}',
        description='Graph testing domain',
        status='PUBLISHED'
    )
    db.add(domain)
    db.flush()

    c1 = m.Concept(domain_id=domain.id, name='Prereq Concept', slug=f'prereq-{uid}', type=m.ConceptType.FOUNDATION)
    c2 = m.Concept(domain_id=domain.id, name='Target Concept', slug=f'target-{uid}', type=m.ConceptType.TECHNIQUE)
    db.add_all([c1, c2])
    db.flush()

    rel = m.ConceptRelation(
        from_concept_id=c1.id,
        to_concept_id=c2.id,
        relation_type=m.ConceptRelationType.REQUIRED_PREREQUISITE,
        strength=1.0
    )
    db.add(rel)
    db.commit()

    queried_domain = db.query(m.Domain).filter(m.Domain.slug == f'test-domain-{uid}').first()
    assert len(queried_domain.concepts) == 2
    assert len(c1.outgoing_relations) == 1
    assert c1.outgoing_relations[0].to_concept_id == c2.id
