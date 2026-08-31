import pytest
import uuid
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.structured_track import StructuredTrackService

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_course_track_locking_and_bypass_exam(db):
    uid = uuid.uuid4().hex[:8]
    user = m.User(email=f'track_{uid}@example.com', hashed_password='fake', full_name='Track Student')
    db.add(user)
    db.flush()

    domain = m.Domain(name=f'Track Dom {uid}', slug=f'tdom-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    # Create Course, Module 1, Module 2, Lessons
    course = m.Course(domain_id=domain.id, title='Clinical Diagnostics Track', slug=f'diag-{uid}', is_published=True)
    db.add(course)
    db.flush()

    mod1 = m.Module(course_id=course.id, title='Module 1: Acid-Base Basics', order_index=1, bypass_fee_in_cents=5000)
    mod2 = m.Module(course_id=course.id, title='Module 2: Advanced HAGMA', order_index=2, bypass_fee_in_cents=7500)
    db.add_all([mod1, mod2])
    db.flush()

    c1 = m.Concept(domain_id=domain.id, name='ABG Concept', slug=f'abg-{uid}')
    c2 = m.Concept(domain_id=domain.id, name='HAGMA Concept', slug=f'hagma-{uid}')
    db.add_all([c1, c2])
    db.flush()

    l1 = m.Lesson(module_id=mod1.id, concept_id=c1.id, title='Lesson 1.1', order_index=1)
    l2 = m.Lesson(module_id=mod2.id, concept_id=c2.id, title='Lesson 2.1', order_index=1)
    db.add_all([l1, l2])
    db.commit()

    # 1. Initial State: Module 1 is unlocked, Module 2 is LOCKED
    track_state = StructuredTrackService.get_course_structure_with_mastery(db, user.id, course.id)
    assert len(track_state['modules']) == 2
    assert track_state['modules'][0]['is_locked'] is False
    assert track_state['modules'][1]['is_locked'] is True

    # 2. Take and Pass Bypass Exam on Module 1
    exam_res = StructuredTrackService.evaluate_module_bypass_exam(
        db=db,
        user_id=user.id,
        module_id=mod1.id,
        responses=[{'score': 0.90}, {'score': 0.85}]
    )
    assert exam_res['passed'] is True
    assert exam_res['status'] == 'UNLOCKED'

    # 3. Verify Module 1 is bypassed, concept fast-tracked, and Module 2 is now UNLOCKED
    updated_track = StructuredTrackService.get_course_structure_with_mastery(db, user.id, course.id)
    assert updated_track['modules'][0]['is_bypassed'] is True
    assert updated_track['modules'][0]['is_completed'] is True
    assert updated_track['modules'][1]['is_locked'] is False

    # 4. Paid Bypass on Module 2
    paid_bypass = StructuredTrackService.record_paid_bypass(db, user.id, mod2.id, transaction_id='tx_12345')
    assert paid_bypass.bypass_type == 'PAID_BYPASS'

    final_track = StructuredTrackService.get_course_structure_with_mastery(db, user.id, course.id)
    assert final_track['modules'][1]['is_bypassed'] is True
