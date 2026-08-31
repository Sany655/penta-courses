import pytest
import uuid
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.goal_engine import GoalEngineService
from backend.app.services.learner_state import LearnerStateService

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_goal_gap_analysis_and_diagnostic_probes(db):
    uid = uuid.uuid4().hex[:8]
    user = m.User(email=f'goal_{uid}@example.com', hashed_password='fake', full_name='Goal Tester')
    db.add(user)
    db.flush()

    domain = m.Domain(name=f'Goal Dom {uid}', slug=f'gdom-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    # Create 3 concepts: Foundation -> Core -> Capstone
    c1 = m.Concept(domain_id=domain.id, name='Prereq Foundation', slug=f'f-{uid}', difficulty=0.4, estimated_learning_effort=30)
    c2 = m.Concept(domain_id=domain.id, name='Core Mechanism', slug=f'c-{uid}', difficulty=0.7, estimated_learning_effort=45)
    c3 = m.Concept(domain_id=domain.id, name='Capstone Goal', slug=f'cap-{uid}', difficulty=0.9, estimated_learning_effort=60)
    db.add_all([c1, c2, c3])
    db.flush()

    db.add(m.ConceptRelation(from_concept_id=c1.id, to_concept_id=c2.id, relation_type='REQUIRED_PREREQUISITE'))
    db.add(m.ConceptRelation(from_concept_id=c2.id, to_concept_id=c3.id, relation_type='REQUIRED_PREREQUISITE'))

    a1 = m.Activity(concept_id=c1.id, title='Foundation Activity', activity_type='PRACTICE', archetype='sequence_engine', difficulty=0.4)
    db.add(a1)
    db.commit()

    # User sets goal specifically on Capstone (c3)
    goal = m.Goal(
        user_id=user.id,
        domain_id=domain.id,
        title='Master Capstone Goal',
        target_concept_ids=[c3.id],
        target_level='L4'
    )
    db.add(goal)
    db.commit()

    # Initial Gap Analysis: Requires all 3 (c1, c2, c3). None mastered -> 0% progress, 135 minutes remaining
    gap = GoalEngineService.analyze_goal_gap(db, user.id, goal.id)
    assert gap['completion_percentage'] == 0.0
    assert gap['total_concepts'] == 3
    assert gap['unknown_count'] == 3
    assert gap['actionable_count'] == 1  # Only c1 has satisfied prereqs
    assert gap['blocked_count'] == 2     # c2 and c3 are blocked
    assert gap['estimated_remaining_hours'] == 2.2  # 135 min / 60

    # Diagnostic Probe Execution: Fast-track c1
    GoalEngineService.process_diagnostic_probe_results(db, user.id, goal.id, [
        {'concept_id': c1.id, 'score': 0.90}
    ])

    gap_after_probe = GoalEngineService.analyze_goal_gap(db, user.id, goal.id)
    assert gap_after_probe['mastered_count'] == 1
    assert round(gap_after_probe['completion_percentage'], 1) == 33.3
    assert gap_after_probe['actionable_count'] == 1  # Now c2 is actionable!
