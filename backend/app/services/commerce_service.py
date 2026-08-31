import uuid
import hashlib
import hmac
import time
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
import backend.app.models as m
from backend.app.core.config import settings

class CommerceService:
    @staticmethod
    def verify_stripe_webhook_signature(payload_bytes: bytes, sig_header: str, secret: str) -> bool:
        """
        Cryptographically verifies Stripe webhook signature using HMAC-SHA256.
        """
        if not sig_header or not secret:
            return False
        try:
            # Parse timestamp and signatures from Stripe header format: t=timestamp,v1=signature
            elements = dict(item.strip().split("=") for item in sig_header.split(","))
            timestamp = elements.get("t")
            v1_signature = elements.get("v1")
            if not timestamp or not v1_signature:
                return False

            # Prevent replay attacks: tolerance 5 minutes
            if abs(time.time() - int(timestamp)) > 300:
                return False

            signed_payload = f"{timestamp}.".encode("utf-8") + payload_bytes
            expected_signature = hmac.new(
                secret.encode("utf-8"), signed_payload, hashlib.sha256
            ).hexdigest()

            return hmac.compare_digest(expected_signature, v1_signature)
        except Exception:
            return False

    @staticmethod
    def verify_bkash_webhook_signature(payload_bytes: bytes, sig_header: str, secret: str) -> bool:
        """
        Cryptographically verifies bKash webhook signature using HMAC-SHA256.
        """
        if not sig_header or not secret:
            return False
        try:
            expected_signature = hmac.new(
                secret.encode("utf-8"), payload_bytes, hashlib.sha256
            ).hexdigest()
            return hmac.compare_digest(expected_signature, sig_header)
        except Exception:
            return False

    @staticmethod
    def get_product_catalog(db: Session, currency: str = "USD") -> List[Dict[str, Any]]:
        """
        Returns the active production product catalog with pricing and entitlements.
        """
        courses = db.query(m.Course).filter(m.Course.is_published == True).all()
        products = []

        # 1. Free Diagnostic & Adaptive Tier
        products.append({
            "product_id": "tier-free-diagnostic",
            "name": "Free 3-Minute Diagnostic Probe",
            "type": "FREE_TIER",
            "price": 0.0,
            "currency": currency,
            "description": "Immediate 5-D competence radar, knowledge gap analysis, and interactive DAG exploration with genuine pedagogical feedback.",
            "entitlements": ["FREE_ADAPTIVE_MISSION", "DIAGNOSTIC_PROBES", "COMPETENCE_RADAR"]
        })

        # 2. Early-Bird Founder Track (Limited to First 100 Cohort Members)
        founder_price = 29.0 if currency == "USD" else 3300.0
        products.append({
            "product_id": "founder-course-track",
            "name": "Founder Cohort Track Pass",
            "type": "FOUNDER_TRACK",
            "price": founder_price,
            "currency": currency,
            "max_slots": 100,
            "is_founder_offer": True,
            "description": "Full lifetime access to any chosen single Course Track, including Module Bypass Exams and verified graduation certification.",
            "entitlements": ["FOUNDER_COURSE_TRACK", "MODULE_BYPASS_EXAMS", "COURSE_CERTIFICATION"]
        })

        # 3. Premium Adaptive Mission Subscription
        pro_price = 19.0 if currency == "USD" else 2200.0
        products.append({
            "product_id": "tier-pro-mission",
            "name": "Pro Adaptive Mission (Monthly)",
            "type": "SUBSCRIPTION",
            "price": pro_price,
            "currency": currency,
            "description": "Unlimited closed-loop prerequisite repairs, Socratic AI tutor hints, exploration radar, and capstone project submissions.",
            "entitlements": ["PRO_ADAPTIVE_MISSION", "SOCRATIC_AI_TUTOR", "CAPSTONE_PROJECTS"]
        })

        # 3. Course Tracks
        for c in courses:
            c_price_cents = c.price_in_cents or 4999
            c_price = (c_price_cents / 100.0) if currency == "USD" else ((c_price_cents / 100.0) * 115.0)
            products.append({
                "product_id": f"course-{c.id}",
                "name": c.title,
                "type": "COURSE",
                "item_id": c.id,
                "price": round(c_price, 2),
                "currency": currency,
                "description": c.description or f"Structured track covering full mastery syllabus for {c.title}.",
                "entitlements": [f"COURSE_ACCESS_{c.id}", "MODULE_BYPASS_EXAMS", "COURSE_CERTIFICATION"]
            })

        return products

    @staticmethod
    def create_checkout(
        db: Session,
        user_id: str,
        item_type: str,  # COURSE, MODULE_BYPASS, CERTIFICATE, SUBSCRIPTION
        item_id: str,
        provider: str = "BKASH",  # BKASH, STRIPE
        currency: str = "BDT",
        amount: Optional[float] = None
    ) -> Dict[str, Any]:
        user = db.query(m.User).filter(m.User.id == user_id).first()
        if not user:
            raise ValueError("User not found")

        computed_amount_cents = int((amount * 100) if amount else 1000)
        if item_type == "COURSE":
            c = db.query(m.Course).filter(m.Course.id == item_id).first()
            if c and c.price_in_cents:
                computed_amount_cents = c.price_in_cents
        elif item_type == "MODULE_BYPASS":
            mod = db.query(m.Module).filter(m.Module.id == item_id).first()
            if mod:
                computed_amount_cents = getattr(mod, "bypass_fee_in_cents", 299)
        elif item_type == "CERTIFICATE":
            computed_amount_cents = int((amount * 100) if amount else 2500)

        tx_ref = f"TX-{provider[:2]}-{uuid.uuid4().hex[:10].upper()}"

        tx = m.Transaction(
            user_id=user_id,
            provider=provider,
            transaction_ref=tx_ref,
            amount_in_cents=computed_amount_cents,
            currency=currency,
            status="PENDING",
            item_type=item_type,
            item_id=item_id,
            metadata_json={},
            created_at=datetime.now(timezone.utc)
        )
        db.add(tx)
        db.commit()
        db.refresh(tx)

        checkout_base = settings.FRONTEND_URL.rstrip("/")
        return {
            "transaction_id": tx.id,
            "transaction_ref": tx.transaction_ref,
            "item_type": item_type,
            "item_id": item_id,
            "amount": round(computed_amount_cents / 100.0, 2),
            "currency": currency,
            "provider": provider,
            "checkout_url": f"{checkout_base}/checkout?tx={tx.id}&provider={provider.lower()}"
        }

    @staticmethod
    def fulfill_order(
        db: Session,
        transaction_id: str,
        item_type: str,
        item_id: str,
        provider_payment_id: str
    ) -> Dict[str, Any]:
        tx = db.query(m.Transaction).filter(
            (m.Transaction.id == transaction_id) | (m.Transaction.transaction_ref == transaction_id)
        ).first()
        if not tx:
            raise ValueError("Transaction not found")

        # Idempotency Protection: If transaction is already fulfilled, return existing details
        if tx.status == "SUCCESS":
            return {
                "transaction_id": tx.id,
                "status": "ALREADY_FULFILLED",
                "item_type": tx.item_type,
                "item_id": tx.item_id,
                "details": tx.metadata_json or {}
            }

        tx.status = "SUCCESS"
        user_id = tx.user_id
        fulfillment_meta = {"provider_payment_id": provider_payment_id}

        if item_type == "COURSE":
            enrollment = db.query(m.Enrollment).filter(
                m.Enrollment.user_id == user_id,
                m.Enrollment.course_id == item_id
            ).first()
            if not enrollment:
                enrollment = m.Enrollment(
                    user_id=user_id,
                    course_id=item_id,
                    is_active=True,
                    enrolled_at=datetime.now(timezone.utc)
                )
                db.add(enrollment)
                db.flush()
            fulfillment_meta["enrollment_id"] = enrollment.id

        elif item_type == "MODULE_BYPASS":
            bypass = db.query(m.ModuleBypass).filter(
                m.ModuleBypass.user_id == user_id,
                m.ModuleBypass.module_id == item_id
            ).first()
            if not bypass:
                bypass = m.ModuleBypass(
                    user_id=user_id,
                    module_id=item_id,
                    bypass_type="PAID_BYPASS",
                    score=1.0,
                    transaction_id=tx.id,
                    unlocked_at=datetime.now(timezone.utc)
                )
                db.add(bypass)
                db.flush()
            fulfillment_meta["bypass_id"] = bypass.id

        elif item_type == "CERTIFICATE":
            raw_str = f"{user_id}:{item_id}:{datetime.now(timezone.utc).isoformat()}:{uuid.uuid4().hex}"
            v_hash = hashlib.sha256(raw_str.encode("utf-8")).hexdigest()
            cert = m.Certificate(
                user_id=user_id,
                course_id=item_id,
                title="Mastery & Capstone Verified Certificate",
                verification_hash=v_hash,
                score=1.0,
                issued_at=datetime.now(timezone.utc)
            )
            db.add(cert)
            db.flush()
            fulfillment_meta["certificate_id"] = cert.id
            fulfillment_meta["verification_hash"] = v_hash

        # Grant general Entitlement
        entitlement = m.Entitlement(
            user_id=user_id,
            item_type=item_type,
            item_id=item_id,
            is_active=True,
            granted_at=datetime.now(timezone.utc)
        )
        db.add(entitlement)
        
        tx.metadata_json = fulfillment_meta
        db.commit()

        return {
            "transaction_id": tx.id,
            "status": "FULFILLED",
            "item_type": item_type,
            "item_id": item_id,
            "details": fulfillment_meta
        }

    @staticmethod
    def verify_certificate(db: Session, verification_hash: str) -> Dict[str, Any]:
        cert = db.query(m.Certificate).filter(m.Certificate.verification_hash == verification_hash).first()
        if not cert:
            return {"is_valid": False, "message": "Certificate hash not found"}

        user = db.query(m.User).filter(m.User.id == cert.user_id).first()
        course = db.query(m.Course).filter(m.Course.id == cert.course_id).first() if cert.course_id else None

        return {
            "is_valid": True,
            "certificate_id": cert.id,
            "recipient_name": user.full_name if user else "Verified Scholar",
            "title": cert.title,
            "course_title": course.title if course else "Advanced Knowledge Specialization",
            "score": cert.score,
            "issued_at": cert.issued_at.isoformat() if cert.issued_at else None,
            "verification_hash": cert.verification_hash,
            "issuer": settings.BRAND_NAME
        }
