import pytest
import uuid
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.core.security import get_password_hash

client = TestClient(app)

@pytest.fixture(scope='module')
def auth_header():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    uid = uuid.uuid4().hex[:8]
    email = f'session_loop_{uid}@pentacourse.com'
    password = 'Password2026!'

    user = m.User(
        email=email,
        hashed_password=get_password_hash(password),
        full_name='Session Loop Tester',
        role=m.UserRole.STUDENT
    )
    db.add(user)
    db.commit()

    # Create domain with 2 concepts and an activity
    domain = m.Domain(name=f'Session Loop Dom {uid}', slug=f'sldom-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    c1 = m.Concept(domain_id=domain.id, name='Session Concept 1', slug=f'sc1-{uid}')
    c2 = m.Concept(domain_id=domain.id, name='Session Concept 2', slug=f'sc2-{uid}')
    db.add_all([c1, c2])
    db.flush()

    db.add(m.ConceptRelation(from_concept_id=c1.id, to_concept_id=c2.id, relation_type='REQUIRED_PREREQUISITE'))

    a1 = m.Activity(
        concept_id=c1.id,
        title='Activity for Concept 1',
        activity_type='PRACTICE',
        archetype='sequence_engine',
        difficulty=0.5,
        estimated_minutes=15,
        data_json={'steps': ['Step 1', 'Step 2']}
    )
    a2 = m.Activity(
        concept_id=c2.id,
        title='Activity for Concept 2',
        activity_type='IMPLEMENT',
        archetype='causal_graph',
        difficulty=0.7,
        estimated_minutes=20,
        data_json={'nodes': ['Node A', 'Node B']}
    )
    db.add_all([a1, a2])
    db.commit()

    domain_id = str(domain.id)
    a1_id = str(a1.id)
    a2_id = str(a2.id)
    db.close()

    # Login to get JWT
    res = client.post('/api/v1/auth/login', json={'email': email, 'password': password})
    token = res.json()['access_token']
    return {'Authorization': f'Bearer {token}', 'domain_id': domain_id, 'activity1_id': a1_id, 'activity2_id': a2_id}

def test_complete_adaptive_session_loop(auth_header):
    headers = {'Authorization': auth_header['Authorization']}
    domain_id = auth_header['domain_id']
    act1_id = auth_header['activity1_id']

    # 1. Start Session
    start_res = client.post('/api/v1/sessions/start', json={'domain_id': domain_id}, headers=headers)
    assert start_res.status_code == 200
    session_id = start_res.json()['id']
    assert start_res.json()['status'] == 'ACTIVE'

    # 2. Get Mission
    mission_res = client.get(f'/api/v1/sessions/{session_id}/mission', headers=headers)
    assert mission_res.status_code == 200
    mission = mission_res.json()
    assert mission['action'] == 'LEARN'
    assert len(mission['reasons']) >= 1

    # 3. Submit Attempt (PASS)
    attempt_res = client.post(f'/api/v1/sessions/{session_id}/attempt', json={
        'activity_id': act1_id,
        'answer_json': {'score': 0.95, 'correct': True},
        'time_taken_seconds': 45,
        'self_confidence': 0.9,
        'telemetry_json': {'hesitations': 0, 'completed_steps': 2}
    }, headers=headers)

    assert attempt_res.status_code == 200
    attempt_data = attempt_res.json()
    assert attempt_data['result'] == 'PASS'
    assert attempt_data['score'] == 0.95
    assert attempt_data['mastery_delta'] > 0
    assert 'next_mission' in attempt_data

    # 4. Complete Session
    complete_res = client.post(f'/api/v1/sessions/{session_id}/complete', headers=headers)
    assert complete_res.status_code == 200
    assert complete_res.json()['status'] == 'COMPLETED'
