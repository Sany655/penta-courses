from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
import backend.app.schemas.learner as s
from backend.app.services.goal_engine import GoalEngineService

router = APIRouter(prefix='/goals', tags=['Goals & Gap Analysis'])

@router.get('', response_model=List[s.GoalOut])
def list_goals(
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(m.Goal).filter(m.Goal.user_id == current_user.id).all()

@router.post('', response_model=s.GoalOut)
def create_goal(
    goal_in: s.GoalCreate,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goal = m.Goal(
        user_id=current_user.id,
        domain_id=goal_in.domain_id,
        title=goal_in.title,
        description=goal_in.description,
        target_concept_ids=goal_in.target_concept_ids,
        target_skill_ids=goal_in.target_skill_ids,
        target_level=goal_in.target_level or 'L3',
        deadline=goal_in.deadline
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal

@router.get('/{goal_id}/gap-analysis')
def get_goal_gap_analysis(
    goal_id: str,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return GoalEngineService.analyze_goal_gap(db, current_user.id, goal_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post('/{goal_id}/diagnostic-probe')
def generate_diagnostic_probe(
    goal_id: str,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return GoalEngineService.generate_diagnostic_probe(db, current_user.id, goal_id)

@router.post('/{goal_id}/diagnostic-probe/submit')
def submit_diagnostic_probe(
    goal_id: str,
    results: List[Dict[str, Any]],
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return GoalEngineService.process_diagnostic_probe_results(db, current_user.id, goal_id, results)
