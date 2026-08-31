import pytest
import uuid
from backend.app.core.database import SessionLocal, Base, engine
import backend.app.models as m
from backend.app.services.commerce_service import CommerceService

@pytest.fixture(scope='module')
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_commerce_checkout_fulfillment_and_certificates(db):
    uid = uuid.uuid4().hex[:6]
    user = m.User(email=f'shopper_{uid}@example.com', hashed_password='fake', full_name='E-Commerce Buyer')
    db.add(user)
    db.flush()

    domain = m.Domain(name=f'Commerce Dom {uid}', slug=f'cdom-{uid}', status='PUBLISHED')
    db.add(domain)
    db.flush()

    course = m.Course(domain_id=domain.id, title='Clinical Resuscitation Course', slug=f'crc-{uid}', price_in_cents=2999)
    db.add(course)
    db.flush()

    mod = m.Module(course_id=course.id, title='Advanced Acidosis Module', order_index=1, bypass_fee_in_cents=999)
    db.add(mod)
    db.commit()

    # 1. Create bKash Checkout for Course
    checkout1 = CommerceService.create_checkout(
        db, user.id, item_type='COURSE', item_id=course.id, provider='BKASH', currency='BDT'
    )
    assert checkout1['amount'] == 29.99
    assert checkout1['provider'] == 'BKASH'

    # 2. Fulfill Course Order -> Enrollment Created
    fulfill1 = CommerceService.fulfill_order(
        db, checkout1['transaction_id'], item_type='COURSE', item_id=course.id, provider_payment_id='bkash_pay_98765'
    )
    assert fulfill1['status'] == 'FULFILLED'
    enrollment = db.query(m.Enrollment).filter(m.Enrollment.user_id == user.id, m.Enrollment.course_id == course.id).first()
    assert enrollment is not None

    # 3. Create Stripe Checkout for Module Bypass
    checkout2 = CommerceService.create_checkout(
        db, user.id, item_type='MODULE_BYPASS', item_id=mod.id, provider='STRIPE', currency='USD'
    )
    assert checkout2['amount'] == 9.99

    # 4. Fulfill Module Bypass -> ModuleBypass Created
    fulfill2 = CommerceService.fulfill_order(
        db, checkout2['transaction_id'], item_type='MODULE_BYPASS', item_id=mod.id, provider_payment_id='ch_stripe_112233'
    )
    assert fulfill2['status'] == 'FULFILLED'
    bypass = db.query(m.ModuleBypass).filter(m.ModuleBypass.user_id == user.id, m.ModuleBypass.module_id == mod.id).first()
    assert bypass is not None
    assert bypass.bypass_type == 'PAID_BYPASS'

    # 5. Issue and Verify Certificate
    checkout3 = CommerceService.create_checkout(
        db, user.id, item_type='CERTIFICATE', item_id=course.id, provider='STRIPE', currency='USD', amount=49.0
    )
    fulfill3 = CommerceService.fulfill_order(
        db, checkout3['transaction_id'], item_type='CERTIFICATE', item_id=course.id, provider_payment_id='ch_cert_4455'
    )
    v_hash = fulfill3['details']['verification_hash']
    assert v_hash is not None

    verify_res = CommerceService.verify_certificate(db, v_hash)
    assert verify_res['is_valid'] is True
    assert verify_res['recipient_name'] == 'E-Commerce Buyer'
