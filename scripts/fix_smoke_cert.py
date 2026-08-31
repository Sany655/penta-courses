import os

with open('backend/tests/test_production_smoke.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_step5 = """    # 5. Certificate Verification Flow
    db = SessionLocal()
    user = db.query(m.User).filter(m.User.email == email).first()
    cert_fulfillment = CommerceService.fulfill_order(
        db, transaction_id=tx_id, item_type="CERTIFICATE", item_id=course_id, provider_payment_id=f"cert_pay_{uid}"
    )
    cert_hash = cert_fulfillment["details"]["verification_hash"]
    db.close()"""

new_step5 = """    # 5. Certificate Verification Flow
    db = SessionLocal()
    user = db.query(m.User).filter(m.User.email == email).first()
    cert_tx = CommerceService.create_checkout(
        db, user_id=user.id, item_type="CERTIFICATE", item_id=course_id, provider="STRIPE", currency="USD", amount=25.0
    )
    cert_fulfillment = CommerceService.fulfill_order(
        db, transaction_id=cert_tx["transaction_id"], item_type="CERTIFICATE", item_id=course_id, provider_payment_id=f"cert_pay_{uid}"
    )
    cert_hash = cert_fulfillment["details"]["verification_hash"]
    db.close()"""

code = code.replace(old_step5, new_step5)
with open('backend/tests/test_production_smoke.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated certificate checkout transaction in test_production_smoke.py!')
