from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
from backend.app.services.curiosity_engine import CuriosityEngineService

router = APIRouter(prefix='/curiosity', tags=['Curiosity Engine & Exploration'])

class CuriosityCaptureIn(BaseModel):
    title: str
    domain: Optional[str] = None
    reason: Optional[str] = None
    interest_score: Optional[float] = 0.6

class ExplorationItemOut(BaseModel):
    id: str
    title: str
    domain: Optional[str] = None
    reason: Optional[str] = None
    interest_score: float
    times_mentioned: int
    times_revisited: int
    status: str
    model_config = ConfigDict(from_attributes=True)

@router.get('/radar', response_model=List[ExplorationItemOut])
def get_exploration_radar(
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return CuriosityEngineService.list_exploration_radar(db, current_user.id)

@router.post('/capture', response_model=ExplorationItemOut)
def capture_curiosity(
    data: CuriosityCaptureIn,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return CuriosityEngineService.capture_curiosity_signal(
        db=db,
        user_id=current_user.id,
        title=data.title,
        domain=data.domain,
        reason=data.reason,
        interest_score=data.interest_score or 0.6
    )

@router.post('/{item_id}/promote')
def promote_to_goal(
    item_id: str,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        goal = CuriosityEngineService.promote_exploration_to_goal(db, current_user.id, item_id)
        return {'status': 'PROMOTED', 'goal_id': goal.id, 'title': goal.title}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get('/tangents')
def get_tangent_missions(
    domain_id: str,
    concept_id: str,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return CuriosityEngineService.generate_tangent_missions(db, current_user.id, domain_id, concept_id)
