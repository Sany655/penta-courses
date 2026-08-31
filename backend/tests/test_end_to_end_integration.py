import pytest
import uuid
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.graph_engine import KnowledgeGraphService
from backend.app.services.learner_state import LearnerStateService
from backend.app.services.adaptive_engine import AdaptiveEngineService
from backend.app.services.goal_engine import GoalEngineService
from backend.app.services.curiosity_engine import CuriosityEngineService
from backend.app.services.project_engine import ProjectEngineService
from backend.app.services.structured_track import StructuredTrackService
from backend.app.services.commerce_service import CommerceService
from backend.app.services.telemetry_service import TelemetryService
from backend.app.services.admin_service import AdminService
from backend.app.seeds.seed_data import seed_all

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    seed_all()
    session = SessionLocal()
    yield session
    session.close()

def test_full_unified_hybrid_system_lifecycle(db):
    uid = uuid.uuid4().hex[:6]
    student = m.User(email=f'dr_scholar_{uid}@example.com', hashed_password='fake', full_name='Dr. Sophia Chen')
    db.add(student)
    db.commit()

    # Step 1: Query Seeded Domain & Topological Graph
    med_domain = db.query(m.Domain).filter(m.Domain.slug.like('%clinical-medicine%')).first()
    assert med_domain is not None
    G = KnowledgeGraphService.build_domain_graph(db, med_domain.id)
    assert len(G.nodes) >= 5

    # Step 2: Initialize 5-Dimensional Learner State
    concepts = db.query(m.Concept).filter(m.Concept.domain_id == med_domain.id).all()
    c_abg = next(c for c in concepts if 'ABG' in c.name or 'Arterial Blood Gas' in c.name)
    c_dka = next(c for c in concepts if 'DKA' in c.name or 'Diabetic Ketoacidosis' in c.name)

    s_abg = LearnerStateService.record_diagnostic_mastery(
        db, student.id, c_abg.id, mastery_level=0.92
    )
    assert s_abg.mastery >= 0.85

    # Step 3: Self-Directed Goal & Gap Analysis
    goal = m.Goal(
        user_id=student.id,
        domain_id=med_domain.id,
        title='Master Critical Care Resuscitation',
        target_concept_ids=[c_dka.id]
    )
    db.add(goal)
    db.commit()

    gap_analysis = GoalEngineService.analyze_goal_gap(db, student.id, goal.id)
    assert gap_analysis['goal_id'] == goal.id
    assert gap_analysis['total_concepts'] >= 1

    # Step 4: Deterministic Adaptive Decision Engine
    rec = AdaptiveEngineService.generate_recommendation(db, student.id, med_domain.id)
    assert rec is not None
    assert rec['action'] is not None
    assert rec['target']['id'] is not None

    # Step 5: Curiosity Signal & Exploration Radar Promotion
    CuriosityEngineService.capture_curiosity_signal(
        db, student.id,
        title='DKA Causal Perturbations in Shock',
        domain='Clinical Medicine'
    )
    radar = CuriosityEngineService.list_exploration_radar(db, student.id)
    assert len(radar) >= 1

    # Step 6: Structured Track Progression & Module Bypass Exam
    course = m.Course(domain_id=med_domain.id, title='Clinical Diagnostics Track', slug=f'track-{uid}', price_in_cents=4999)
    db.add(course)
    db.flush()

    mod1 = m.Module(course_id=course.id, title='Acid-Base Foundations', order_index=1, bypass_fee_in_cents=499)
    mod2 = m.Module(course_id=course.id, title='DKA Intensive Resuscitation', order_index=2, bypass_fee_in_cents=799)
    db.add_all([mod1, mod2])
    db.commit()

    # Pass Bypass Exam on Module 1
    bypass_res = StructuredTrackService.evaluate_module_bypass_exam(db, student.id, mod1.id, responses=[{'score': 0.90}])
    assert bypass_res['passed'] is True
    assert bypass_res['status'] == 'UNLOCKED'

    # Instant Paid Bypass on Module 2 via Commerce Service
    checkout = CommerceService.create_checkout(
        db, student.id, item_type='MODULE_BYPASS', item_id=mod2.id, provider='BKASH', currency='BDT'
    )
    fulfill = CommerceService.fulfill_order(
        db, checkout['transaction_id'], item_type='MODULE_BYPASS', item_id=mod2.id, provider_payment_id='bkash_tx_123'
    )
    assert fulfill['status'] == 'FULFILLED'

    # Step 7: Capstone Project & Applied Creation Mode
    project = m.Project(
        user_id=student.id,
        domain_id=med_domain.id,
        name='Full ICU Resuscitation Protocol Implementation',
        scope='CAPSTONE',
        status='ACTIVE'
    )
    db.add(project)
    db.flush()

    t1 = m.ProjectTask(project_id=project.id, concept_id=c_dka.id, title='Electrolyte Calculation Script', required_concepts=[c_dka.id])
    db.add(t1)
    db.commit()

    eval_res = ProjectEngineService.submit_task_solution(
        db, student.id, t1.id,
        submission_data={'score': 1.0, 'verified': True, 'protocol_steps': ['Insulin', 'Saline', 'KCl']}
    )
    assert eval_res['status'] == 'VERIFIED'
    assert eval_res['project_completed'] is True

    # Step 8: Certificate Issuance & Verification
    cert_order = CommerceService.create_checkout(
        db, student.id, item_type='CERTIFICATE', item_id=course.id, provider='STRIPE', currency='USD', amount=25.0
    )
    cert_fulfill = CommerceService.fulfill_order(
        db, cert_order['transaction_id'], item_type='CERTIFICATE', item_id=course.id, provider_payment_id='stripe_cert_888'
    )
    v_hash = cert_fulfill['details']['verification_hash']

    cert_check = CommerceService.verify_certificate(db, v_hash)
    assert cert_check['is_valid'] is True
    assert cert_check['recipient_name'] == 'Dr. Sophia Chen'

    # Step 9: Telemetry & Observability Aggregations
    telemetry_summary = TelemetryService.get_learner_telemetry_summary(db, student.id)
    assert telemetry_summary['user_id'] == student.id
