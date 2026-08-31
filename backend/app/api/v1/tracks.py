from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
from backend.app.services.structured_track import StructuredTrackService

router = APIRouter(prefix='/tracks', tags=['Structured Track & Bypass Exams'])

class BypassExamIn(BaseModel):
    responses: List[Dict[str, Any]]

class BypassPayIn(BaseModel):
    transaction_id: Optional[str] = None

@router.get('/courses')
def list_courses(db: Session = Depends(get_db)):
    courses = db.query(m.Course).filter(m.Course.is_published == True).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "slug": c.slug,
            "description": c.description,
            "price_in_cents": c.price_in_cents,
            "difficulty": c.difficulty,
            "category": c.category
        }
        for c in courses
    ]

@router.get('/courses/{course_id}/progress')
def get_track_progress(
    course_id: str,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return StructuredTrackService.get_course_structure_with_mastery(db, current_user.id, course_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post('/modules/{module_id}/bypass-exam')
def submit_bypass_exam(
    module_id: str,
    data: BypassExamIn,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return StructuredTrackService.evaluate_module_bypass_exam(db, current_user.id, module_id, data.responses)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post('/modules/{module_id}/bypass-pay')
def submit_bypass_payment(
    module_id: str,
    data: BypassPayIn,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        bypass = StructuredTrackService.record_paid_bypass(db, current_user.id, module_id, data.transaction_id)
        return {'status': 'UNLOCKED', 'bypass_id': bypass.id, 'module_id': bypass.module_id}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
