import pytest
import uuid
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.admin_service import AdminService

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_admin_workbench_and_mastery_overrides(db):
    uid = uuid.uuid4().hex[:6]
    admin = m.User(email=f'admin_{uid}@example.com', hashed_password='fake', full_name='Admin Ops', role='SUPER_ADMIN')
    student = m.User(email=f'student_{uid}@example.com', hashed_password='fake', full_name='Student Ops')
    db.add_all([admin, student])
    db.commit()

    # 1. System stats
    stats = AdminService.get_system_overview_stats(db)
    assert stats['total_users'] >= 2

    # 2. Upsert Domain
    dom_slug = f'neuro-{uid}'
    dom_name = f'Neurophysiology {uid}'
    domain = AdminService.create_or_update_domain(
        db, admin.id, name=dom_name, slug=dom_slug, difficulty=0.85
    )
    assert domain.slug == dom_slug

    # 3. Upsert Concepts
    c1 = AdminService.create_or_update_concept(db, admin.id, domain.id, 'Action Potential Kinetics', f'ap-{dom_slug}', 'FOUNDATION', 0.6)
    c2 = AdminService.create_or_update_concept(db, admin.id, domain.id, 'LTP Synaptic Plasticity', f'ltp-{dom_slug}', 'THEORY', 0.8)

    # 4. Add Relation
    rel = AdminService.add_concept_relation(db, admin.id, domain.id, c1.id, c2.id, 'REQUIRED_PREREQUISITE')
    assert rel.from_concept_id == c1.id

    # 5. Cycle creation throws ValueError
    with pytest.raises(ValueError, match="creates a cycle"):
        AdminService.add_concept_relation(db, admin.id, domain.id, c2.id, c1.id, 'REQUIRED_PREREQUISITE')

    # 6. Override Learner Mastery
    override_state = AdminService.override_learner_mastery(
        db, admin.id, student.id, c1.id, 0.95, reason='Verified through oral examination'
    )
    assert override_state.mastery == 0.95
    assert override_state.confidence == 1.0

    # 7. Audit log verification
    audits = db.query(m.AdminAuditLog).filter(m.AdminAuditLog.admin_id == admin.id).all()
    assert len(audits) >= 4

    # 8. Dynamic Pricing Update
    course = m.Course(domain_id=domain.id, title='Neurobiology', slug=f'nb-{dom_slug}', price_in_cents=1000)
    db.add(course)
    db.flush()

    pricing_res = AdminService.update_pricing_and_bypasses(db, admin.id, course_id=course.id, price_in_cents=4999)
    assert pricing_res['new_course_price'] == 4999
