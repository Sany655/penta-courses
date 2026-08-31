import pytest
import uuid
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.telemetry_service import TelemetryService

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_telemetry_and_closed_loop_observability(db):
    uid = uuid.uuid4().hex[:6]
    user = m.User(email=f'telemetry_{uid}@example.com', hashed_password='fake', full_name='Telemetry Student')
    db.add(user)
    db.flush()

    dom = m.Domain(name=f'Telemetry Dom {uid}', slug=f'tdom-{uid}', status='PUBLISHED')
    db.add(dom)
    db.flush()

    sess = m.LearningSession(user_id=user.id, domain_id=dom.id, status='ACTIVE')
    db.add(sess)
    db.flush()

    # 1. Log Telemetry Events
    ev1 = TelemetryService.record_event(
        db, user.id, event_type='BLOCK_INTERACTION', session_id=sess.id, entity_type='ACTIVITY', entity_id='act-101',
        payload={'archetype': 'sequence_engine', 'time_on_task_ms': 14200, 'hesitation_score': 0.12}
    )
    assert ev1.id is not None
    assert ev1.event_type == 'BLOCK_INTERACTION'

    # 2. Add an attempt with failure to test failure distribution
    c = m.Concept(domain_id=dom.id, name=f'Telemetry Concept {uid}', slug=f'tcon-{uid}', type='CONCEPT', difficulty=0.5)
    db.add(c)
    db.flush()

    act = m.Activity(concept_id=c.id, title='Telemetry Act', activity_type='PRACTICE', archetype='causal_graph', difficulty=0.5)
    db.add(act)
    db.flush()

    attempt = m.Attempt(
        user_id=user.id,
        session_id=sess.id,
        activity_id=act.id,
        result='FAIL',
        score=0.3,
        time_taken_seconds=45,
        answer_json={'answer': 'incorrect'}
    )
    db.add(attempt)
    db.flush()

    fail_ev = m.FailureEvent(
        attempt_id=attempt.id,
        user_id=user.id,
        category='MISCONCEPTION',
        severity=0.8
    )
    db.add(fail_ev)
    db.commit()

    # 3. Verify Telemetry Summary
    summary = TelemetryService.get_learner_telemetry_summary(db, user.id)
    assert summary['total_events_logged'] >= 1
    assert summary['total_attempts'] == 1
    assert summary['success_rate'] == 0.0
    assert summary['failure_taxonomy_distribution'].get('MISCONCEPTION') == 1
