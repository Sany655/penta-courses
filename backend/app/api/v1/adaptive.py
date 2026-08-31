from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
import backend.app.schemas.recommendation as s
from backend.app.services.adaptive_engine import AdaptiveEngineService

router = APIRouter(prefix='/adaptive', tags=['Adaptive Decision Engine'])

@router.get('/recommendation/{domain_id}', response_model=s.RecommendationOut)
def get_recommendation(
    domain_id: str,
    goal_id: str = None,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    domain = db.query(m.Domain).filter(m.Domain.id == domain_id).first()
    if not domain:
        raise HTTPException(status_code=404, detail='Domain not found')
    
    rec = AdaptiveEngineService.generate_recommendation(
        db=db,
        user_id=current_user.id,
        domain_id=domain_id,
        goal_id=goal_id
    )
    return rec
