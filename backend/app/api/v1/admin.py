from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
from backend.app.services.admin_service import AdminService
from backend.app.services.llm_generator import LLMCognitiveGeneratorService

router = APIRouter(prefix='/admin', tags=['Admin Control Panel & Workbench'])

def require_admin(current_user: m.User = Depends(get_current_user)):
    role = (current_user.role or '').upper()
    if role not in {m.UserRole.ADMIN, 'ADMIN', 'SUPER_ADMIN'}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

class DomainUpsertIn(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    difficulty: Optional[float] = 0.5
    status: Optional[str] = 'PUBLISHED'

class ConceptUpsertIn(BaseModel):
    domain_id: str
    name: str
    slug: str
    type: Optional[str] = 'CONCEPT'
    difficulty: Optional[float] = 0.5
    importance: Optional[float] = 1.0
    estimated_learning_effort: Optional[int] = 20

class RelationAddIn(BaseModel):
    domain_id: str
    from_concept_id: str
    to_concept_id: str
    relation_type: Optional[str] = 'REQUIRED_PREREQUISITE'

class MasteryOverrideIn(BaseModel):
    user_id: str
    concept_id: str
    mastery: float
    reason: Optional[str] = None

class PricingUpdateIn(BaseModel):
    course_id: Optional[str] = None
    module_id: Optional[str] = None
    price_in_cents: Optional[int] = None
    bypass_fee_in_cents: Optional[int] = None

class LessonGenerateIn(BaseModel):
    prompt: str

class LessonSaveIn(BaseModel):
    course_id: str
    module_id: str
    title: str
    blocks: List[Dict[str, Any]]

class InquiryStatusIn(BaseModel):
    status: str

class PaymentRejectIn(BaseModel):
    reason: str = 'Payment could not be verified'

class ManualGrantIn(BaseModel):
    student_email: str
    module_id: str

@router.get('/stats')
def get_admin_stats(
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return AdminService.get_system_overview_stats(db)

@router.post('/domains')
def upsert_domain(
    data: DomainUpsertIn,
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return AdminService.create_or_update_domain(
        db=db,
        admin_id=admin.id,
        name=data.name,
        slug=data.slug,
        description=data.description,
        difficulty=data.difficulty or 0.5,
        status=data.status or 'PUBLISHED'
    )

@router.post('/concepts')
def upsert_concept(
    data: ConceptUpsertIn,
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return AdminService.create_or_update_concept(
        db=db,
        admin_id=admin.id,
        domain_id=data.domain_id,
        name=data.name,
        slug=data.slug,
        concept_type=data.type or 'CONCEPT',
        difficulty=data.difficulty or 0.5,
        importance=data.importance or 1.0,
        estimated_learning_effort=data.estimated_learning_effort or 20
    )

@router.post('/relations')
def add_relation(
    data: RelationAddIn,
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    try:
        return AdminService.add_concept_relation(
            db=db,
            admin_id=admin.id,
            domain_id=data.domain_id,
            from_concept_id=data.from_concept_id,
            to_concept_id=data.to_concept_id,
            relation_type=data.relation_type or 'REQUIRED_PREREQUISITE'
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post('/overrides/mastery')
def override_mastery(
    data: MasteryOverrideIn,
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return AdminService.override_learner_mastery(
        db=db,
        admin_id=admin.id,
        user_id=data.user_id,
        concept_id=data.concept_id,
        mastery_value=data.mastery,
        reason=data.reason
    )

@router.post('/commerce/pricing')
def update_pricing(
    data: PricingUpdateIn,
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return AdminService.update_pricing_and_bypasses(
        db=db,
        admin_id=admin.id,
        course_id=data.course_id,
        module_id=data.module_id,
        price_in_cents=data.price_in_cents,
        bypass_fee_in_cents=data.bypass_fee_in_cents
    )

@router.post('/lessons/generate')
def generate_lesson(
    data: LessonGenerateIn,
    admin: m.User = Depends(require_admin)
):
    prompt = data.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail='A lesson prompt is required')

    activity = LLMCognitiveGeneratorService.generate_activity_payload(
        archetype='sequence_engine',
        concept_name=prompt,
        domain_name='Multi-Domain',
        difficulty=0.7
    )
    return {
        'blocks': [{
            'id': 'generated-sequence',
            'type': 'markdown',
            'content': {
                'content': f'## {prompt}\n\n' + '\n'.join(
                    f"- **{step['action']}** {step['rationale']}"
                    for step in activity.get('steps', [])
                )
            }
        }]
    }

@router.post('/lessons')
def save_lesson(
    data: LessonSaveIn,
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    module = db.query(m.Module).filter(m.Module.id == data.module_id, m.Module.course_id == data.course_id).first()
    if not module:
        raise HTTPException(status_code=404, detail='Course module not found')

    lesson = m.Lesson(
        module_id=module.id,
        title=data.title,
        order_index=len(module.lessons),
        content_blocks=data.blocks,
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return {'success': True, 'lesson': {'id': lesson.id, 'title': lesson.title}}

@router.get('/inquiries')
def list_inquiries(
    inquiry_status: Optional[str] = Query(None, alias='status'),
    query: Optional[str] = Query(None, alias='q'),
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    inquiries = db.query(m.Inquiry).order_by(m.Inquiry.created_at.desc())
    if inquiry_status and inquiry_status != 'ALL':
        inquiries = inquiries.filter(m.Inquiry.status == inquiry_status)
    if query:
        pattern = f'%{query}%'
        inquiries = inquiries.filter(
            (m.Inquiry.name.ilike(pattern)) |
            (m.Inquiry.email.ilike(pattern)) |
            (m.Inquiry.message.ilike(pattern))
        )
    return inquiries.all()

@router.patch('/inquiries/{inquiry_id}')
def update_inquiry(
    inquiry_id: str,
    data: InquiryStatusIn,
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    inquiry = db.query(m.Inquiry).filter(m.Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail='Inquiry not found')
    if data.status not in {'NEW', 'REVIEWED', 'ARCHIVED'}:
        raise HTTPException(status_code=400, detail='Invalid inquiry status')
    inquiry.status = data.status
    db.commit()
    db.refresh(inquiry)
    return inquiry

@router.delete('/inquiries/{inquiry_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_inquiry(
    inquiry_id: str,
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    inquiry = db.query(m.Inquiry).filter(m.Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail='Inquiry not found')
    db.delete(inquiry)
    db.commit()

@router.get('/commerce/payments')
def list_payments(
    payment_status: Optional[str] = Query(None, alias='status'),
    query: Optional[str] = Query(None, alias='q'),
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    payments = db.query(m.Transaction).order_by(m.Transaction.created_at.desc())
    if payment_status and payment_status != 'ALL':
        payments = payments.filter(m.Transaction.status == payment_status)
    if query:
        pattern = f'%{query}%'
        payments = payments.filter(m.Transaction.transaction_ref.ilike(pattern))
    return [
        {
            'id': payment.id,
            'trxId': payment.transaction_ref,
            'studentEmail': payment.user.email if payment.user else None,
            'studentName': payment.user.full_name if payment.user else None,
            'itemType': payment.item_type,
            'itemId': payment.item_id,
            'itemTitle': (payment.metadata_json or {}).get('item_title', payment.item_id),
            'amount': f"{payment.amount_in_cents / 100:.2f} {payment.currency}",
            'senderPhone': (payment.metadata_json or {}).get('sender_phone', 'N/A'),
            'status': payment.status,
            'timestamp': payment.created_at.isoformat(),
        }
        for payment in payments.all()
    ]

@router.post('/commerce/payments/{transaction_id}/approve')
def approve_payment(
    transaction_id: str,
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    transaction = db.query(m.Transaction).filter(m.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail='Payment not found')
    try:
        return CommerceService.fulfill_order(
            db=db,
            transaction_id=transaction.id,
            item_type=transaction.item_type,
            item_id=transaction.item_id,
            provider_payment_id=transaction.transaction_ref
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

@router.post('/commerce/payments/{transaction_id}/reject')
def reject_payment(
    transaction_id: str,
    data: PaymentRejectIn,
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    transaction = db.query(m.Transaction).filter(m.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail='Payment not found')
    transaction.status = 'FAILED'
    metadata = dict(transaction.metadata_json or {})
    metadata['rejection_reason'] = data.reason
    transaction.metadata_json = metadata
    db.commit()
    db.refresh(transaction)
    return transaction

@router.post('/commerce/grants')
def grant_module_access(
    data: ManualGrantIn,
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(m.User).filter(m.User.email == data.student_email.lower()).first()
    module = db.query(m.Module).filter(m.Module.id == data.module_id).first()
    if not user or not module:
        raise HTTPException(status_code=404, detail='Student or module not found')
    entitlement = m.Entitlement(
        user_id=user.id,
        item_type='MODULE_BYPASS',
        item_id=module.id,
        is_active=True,
    )
    db.add(entitlement)
    db.commit()
    return {'success': True, 'user_id': user.id, 'module_id': module.id}

@router.delete('/commerce/payments/{transaction_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_payment(
    transaction_id: str,
    admin: m.User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    transaction = db.query(m.Transaction).filter(m.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail='Payment not found')
    db.delete(transaction)
    db.commit()
