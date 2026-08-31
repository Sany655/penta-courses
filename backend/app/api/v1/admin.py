from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
from backend.app.services.admin_service import AdminService

router = APIRouter(prefix='/admin', tags=['Admin Control Panel & Workbench'])

def require_admin(current_user: m.User = Depends(get_current_user)):
    if current_user.role not in [m.UserRole.SUPER_ADMIN, m.UserRole.ADMIN, m.UserRole.INSTRUCTOR]:
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
