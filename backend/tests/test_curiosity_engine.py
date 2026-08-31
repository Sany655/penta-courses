import pytest
import uuid
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.curiosity_engine import CuriosityEngineService

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_curiosity_capture_radar_and_promotion(db):
    uid = uuid.uuid4().hex[:8]
    user = m.User(email=f'curiosity_{uid}@example.com', hashed_password='fake', full_name='Curious Tester')
    db.add(user)
    db.flush()

    domain = m.Domain(name=f'Curiosity Dom {uid}', slug=f'cdom-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    c1 = m.Concept(domain_id=domain.id, name='Core Node', slug=f'core-{uid}')
    c2 = m.Concept(domain_id=domain.id, name='Tangent Sister Node', slug=f'tangent-{uid}')
    db.add_all([c1, c2])
    db.flush()

    db.add(m.ConceptRelation(from_concept_id=c1.id, to_concept_id=c2.id, relation_type='RELATED'))
    db.commit()

    # 1. Capture Curiosity Signal
    item1 = CuriosityEngineService.capture_curiosity_signal(
        db, user.id, title='Quantum Biology Mechanisms', domain='Medicine', reason='Curious about enzyme tunneling'
    )
    assert item1.interest_score == 0.6
    assert item1.times_mentioned == 1

    # 2. Re-mention increases interest score
    item1_revisited = CuriosityEngineService.capture_curiosity_signal(
        db, user.id, title='Quantum Biology Mechanisms'
    )
    assert item1_revisited.times_mentioned == 2
    assert item1_revisited.interest_score > 0.7

    # 3. List Radar
    radar = CuriosityEngineService.list_exploration_radar(db, user.id)
    assert len(radar) >= 1
    assert radar[0].title == 'Quantum Biology Mechanisms'

    # 4. Promote to Goal
    goal = CuriosityEngineService.promote_exploration_to_goal(db, user.id, item1.id)
    assert goal.title == 'Master: Quantum Biology Mechanisms'
    assert goal.goal_type == m.GoalType.EXPLORATION

    # 5. Tangent missions from c1
    tangents = CuriosityEngineService.generate_tangent_missions(db, user.id, domain.id, c1.id)
    assert len(tangents) == 1
    assert tangents[0]['concept_id'] == c2.id
