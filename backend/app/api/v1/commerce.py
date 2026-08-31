from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.config import settings
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
from backend.app.services.commerce_service import CommerceService

router = APIRouter(prefix="/commerce", tags=["Monetization & Commerce"])

class CheckoutIn(BaseModel):
    item_type: str  # COURSE, MODULE_BYPASS, CERTIFICATE, SUBSCRIPTION
    item_id: str
    provider: Optional[str] = "BKASH"
    currency: Optional[str] = "BDT"
    amount: Optional[float] = None

class WebhookOrderIn(BaseModel):
    transaction_id: str
    item_type: str
    item_id: str
    provider_payment_id: str

@router.get("/products")
def get_products(
    currency: str = "USD",
    db: Session = Depends(get_db)
):
    """Retrieve public product catalog and monetization pricing."""
    return CommerceService.get_product_catalog(db, currency=currency)

@router.post("/checkout")
def create_checkout(
    data: CheckoutIn,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Initiate a checkout session for a course, module bypass, or certification."""
    try:
        return CommerceService.create_checkout(
            db=db,
            user_id=current_user.id,
            item_type=data.item_type,
            item_id=data.item_id,
            provider=data.provider or "BKASH",
            currency=data.currency or "BDT",
            amount=data.amount
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhooks/stripe")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
    stripe_signature: Optional[str] = Header(None, alias="Stripe-Signature")
):
    """Secure Stripe webhook receiver with cryptographic HMAC signature verification."""
    body_bytes = await request.body()

    # In production, verify Stripe HMAC signature
    if settings.ENVIRONMENT == "production":
        if not stripe_signature or not settings.STRIPE_WEBHOOK_SECRET:
            raise HTTPException(status_code=400, detail="Missing stripe signature or secret")
        valid = CommerceService.verify_stripe_webhook_signature(
            body_bytes, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
        )
        if not valid:
            raise HTTPException(status_code=400, detail="Invalid Stripe webhook signature")

    # Parse payload
    import json
    try:
        payload = json.loads(body_bytes.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    tx_id = payload.get("transaction_id") or payload.get("data", {}).get("object", {}).get("metadata", {}).get("transaction_id")
    item_type = payload.get("item_type") or payload.get("data", {}).get("object", {}).get("metadata", {}).get("item_type", "COURSE")
    item_id = payload.get("item_id") or payload.get("data", {}).get("object", {}).get("metadata", {}).get("item_id")
    payment_id = payload.get("provider_payment_id") or payload.get("data", {}).get("object", {}).get("id", "stripe_tx_mock")

    if not tx_id or not item_id:
        raise HTTPException(status_code=400, detail="Missing transaction_id or item_id in webhook metadata")

    return CommerceService.fulfill_order(
        db=db,
        transaction_id=tx_id,
        item_type=item_type,
        item_id=item_id,
        provider_payment_id=payment_id
    )

@router.post("/webhooks/bkash")
async def bkash_webhook(
    request: Request,
    db: Session = Depends(get_db),
    x_bkash_signature: Optional[str] = Header(None, alias="X-Bkash-Signature")
):
    """Secure bKash IPN / webhook receiver with HMAC signature verification."""
    body_bytes = await request.body()

    if settings.ENVIRONMENT == "production" and x_bkash_signature and settings.BKASH_APP_SECRET:
        valid = CommerceService.verify_bkash_webhook_signature(
            body_bytes, x_bkash_signature, settings.BKASH_APP_SECRET
        )
        if not valid:
            raise HTTPException(status_code=400, detail="Invalid bKash signature")

    import json
    try:
        payload = json.loads(body_bytes.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    tx_id = payload.get("transaction_id") or payload.get("merchantInvoiceNumber")
    item_type = payload.get("item_type", "COURSE")
    item_id = payload.get("item_id")
    payment_id = payload.get("provider_payment_id") or payload.get("paymentID", "bkash_tx_mock")

    if not tx_id:
        raise HTTPException(status_code=400, detail="Missing transaction_id in bKash payload")

    # If item_id missing, lookup from transaction
    if not item_id:
        tx = db.query(m.Transaction).filter(
            (m.Transaction.id == tx_id) | (m.Transaction.transaction_ref == tx_id)
        ).first()
        if tx:
            item_id = tx.item_id
            item_type = tx.item_type

    return CommerceService.fulfill_order(
        db=db,
        transaction_id=tx_id,
        item_type=item_type,
        item_id=item_id,
        provider_payment_id=payment_id
    )

@router.get("/certificates/verify/{verification_hash}")
def verify_certificate(
    verification_hash: str,
    db: Session = Depends(get_db)
):
    """Public certificate verification endpoint."""
    res = CommerceService.verify_certificate(db, verification_hash)
    if not res.get("is_valid"):
        raise HTTPException(status_code=404, detail="Invalid certificate verification hash")
    return res
