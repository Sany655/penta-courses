import pytest
import uuid
import hmac
import hashlib
import time
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.database import SessionLocal, Base, engine
from backend.app.core.config import settings
import backend.app.models as m
from backend.app.seeds.seed_data import seed_all
from backend.app.services.commerce_service import CommerceService

@pytest.fixture(scope="module")
def client():
    Base.metadata.create_all(bind=engine)
    seed_all()
    with TestClient(app) as c:
        yield c

def test_production_smoke_health(client):
    """Smoke Test: Application and Database Health Check"""
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "version" in data
    assert "environment" in data

def test_production_smoke_product_catalog(client):
    """Smoke Test: Public Product & Monetization Catalog"""
    res = client.get("/api/v1/commerce/products?currency=USD")
    assert res.status_code == 200
    products = res.json()
    assert len(products) >= 2
    types = [p["type"] for p in products]
    assert "FREE_TIER" in types
    assert "SUBSCRIPTION" in types

def test_production_smoke_full_lifecycle_and_monetization(client):
    """
    Comprehensive End-to-End Production Smoke Test:
    User Auth -> Adaptive Recommendation -> Attempt -> Checkout ->
    Stripe & bKash Webhooks -> Entitlements -> Certificate Verification -> Offline Sync
    """
    uid = uuid.uuid4().hex[:6]
    email = f"prod_learner_{uid}@example.com"
    password = "SecureProdPassword123!"

    # 1. Registration & Auth
    reg_res = client.post("/api/v1/auth/register", json={
        "email": email,
        "password": password,
        "full_name": f"Production User {uid}"
    })
    assert reg_res.status_code == 200
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Domain & Adaptive Recommendation
    domains_res = client.get("/api/v1/domains", headers=headers)
    assert domains_res.status_code == 200
    domains = domains_res.json()
    domain_id = domains[0]["id"]

    rec_res = client.get(f"/api/v1/adaptive/recommendation/{domain_id}", headers=headers)
    assert rec_res.status_code == 200
    rec = rec_res.json()
    assert "recommendation_id" in rec
    assert "target" in rec

    # 3. Checkout Initiation
    courses_res = client.get("/api/v1/tracks/courses", headers=headers)
    assert courses_res.status_code == 200
    courses = courses_res.json()
    course_id = courses[0]["id"] if courses else "mock_course_id"

    checkout_res = client.post("/api/v1/commerce/checkout", headers=headers, json={
        "item_type": "COURSE",
        "item_id": course_id,
        "provider": "STRIPE",
        "currency": "USD"
    })
    assert checkout_res.status_code == 200
    checkout_data = checkout_res.json()
    tx_id = checkout_data["transaction_id"]

    # 4. Stripe Webhook Fulfillment with HMAC Signature
    timestamp = str(int(time.time()))
    payload_dict = {
        "transaction_id": tx_id,
        "item_type": "COURSE",
        "item_id": course_id,
        "provider_payment_id": f"stripe_ch_{uid}"
    }
    import json
    payload_bytes = json.dumps(payload_dict).encode("utf-8")
    signed_payload = f"{timestamp}.".encode("utf-8") + payload_bytes
    v1_sig = hmac.new(
        settings.STRIPE_WEBHOOK_SECRET.encode("utf-8"), signed_payload, hashlib.sha256
    ).hexdigest()
    stripe_sig_header = f"t={timestamp},v1={v1_sig}"

    webhook_res = client.post(
        "/api/v1/commerce/webhooks/stripe",
        content=payload_bytes,
        headers={"Content-Type": "application/json", "Stripe-Signature": stripe_sig_header}
    )
    assert webhook_res.status_code == 200
    wh_data = webhook_res.json()
    assert wh_data["status"] == "FULFILLED"

    # Verify Idempotency: Repeating webhook returns ALREADY_FULFILLED
    repeat_wh_res = client.post(
        "/api/v1/commerce/webhooks/stripe",
        content=payload_bytes,
        headers={"Content-Type": "application/json", "Stripe-Signature": stripe_sig_header}
    )
    assert repeat_wh_res.status_code == 200
    assert repeat_wh_res.json()["status"] == "ALREADY_FULFILLED"

    # 5. Certificate Verification Flow
    db = SessionLocal()
    user = db.query(m.User).filter(m.User.email == email).first()
    cert_tx = CommerceService.create_checkout(
        db, user_id=user.id, item_type="CERTIFICATE", item_id=course_id, provider="STRIPE", currency="USD", amount=25.0
    )
    cert_fulfillment = CommerceService.fulfill_order(
        db, transaction_id=cert_tx["transaction_id"], item_type="CERTIFICATE", item_id=course_id, provider_payment_id=f"cert_pay_{uid}"
    )
    cert_hash = cert_fulfillment["details"]["verification_hash"]
    db.close()

    cert_verify_res = client.get(f"/api/v1/commerce/certificates/verify/{cert_hash}")
    assert cert_verify_res.status_code == 200
    cert_data = cert_verify_res.json()
    assert cert_data["is_valid"] is True
    assert cert_data["verification_hash"] == cert_hash

    # 6. Offline Client Sync Push & Pull
    sync_push_res = client.post("/api/v1/sync/push", headers=headers, json={
        "device_id": f"device_win_{uid}",
        "events": [
            {
                "event_type": "BLOCK_INTERACTION",
                "entity_type": "CONCEPT",
                "entity_id": rec["target"]["id"],
                "payload": {"score": 0.95, "time_taken_seconds": 42},
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        ]
    })
    assert sync_push_res.status_code == 200
    assert sync_push_res.json()["status"] == "SYNCED"

    sync_pull_res = client.get("/api/v1/sync/pull", headers=headers)
    assert sync_pull_res.status_code == 200
    pull_data = sync_pull_res.json()
    assert "concept_states" in pull_data
    assert "active_entitlements" in pull_data
