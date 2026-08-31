import pytest
import uuid
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.project_engine import ProjectEngineService

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_capstone_project_creation_and_task_verification(db):
    uid = uuid.uuid4().hex[:8]
    user = m.User(email=f'project_{uid}@example.com', hashed_password='fake', full_name='Capstone Builder')
    db.add(user)
    db.flush()

    domain = m.Domain(name=f'Project Dom {uid}', slug=f'pdom-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    c1 = m.Concept(domain_id=domain.id, name='Async Networking Core', slug=f'anc-{uid}')
    db.add(c1)
    db.commit()

    # 1. Create Capstone Project with 2 Milestones
    project = ProjectEngineService.create_project(
        db=db,
        user_id=user.id,
        domain_id=domain.id,
        title='High-Throughput WebSocket Server',
        description='Build an asynchronous non-blocking real-time distributed broker.',
        tasks_def=[
            {
                'concept_id': c1.id,
                'title': 'Implement Event-Loop Socket Polling',
                'description': 'Construct select/epoll multiplexing wrapper.',
                'rubric_json': {'concurrency_target': 10000}
            },
            {
                'concept_id': c1.id,
                'title': 'Distributed Heartbeat & Ping Protocol',
                'description': 'Manage connection keepalive and stale eviction.'
            }
        ]
    )

    assert project.status == 'ACTIVE'
    details = ProjectEngineService.get_project_details(db, user.id, project.id)
    assert len(details['tasks']) == 2
    task1_id = details['tasks'][0]['id']
    task2_id = details['tasks'][1]['id']

    # 2. Submit Milestone 1
    res1 = ProjectEngineService.submit_task_solution(
        db, user.id, task1_id,
        {'code': 'async def run(): pass', 'verified': True, 'score': 1.0}
    )
    assert res1['status'] == 'VERIFIED'
    assert res1['project_completed'] is False

    # 3. Verify concept creation strength boosted
    cs = db.query(m.LearnerConceptState).filter(
        m.LearnerConceptState.user_id == user.id,
        m.LearnerConceptState.concept_id == c1.id
    ).first()
    assert cs is not None
    assert cs.creation_strength > 0.0

    # 4. Submit Milestone 2 -> Project Completion
    res2 = ProjectEngineService.submit_task_solution(
        db, user.id, task2_id,
        {'code': 'async def heartbeat(): pass', 'verified': True, 'score': 0.95}
    )
    assert res2['status'] == 'VERIFIED'
    assert res2['project_completed'] is True
    assert res2['project_status'] == 'COMPLETED'
