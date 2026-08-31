from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
from backend.app.services.project_engine import ProjectEngineService

router = APIRouter(prefix='/projects', tags=['Capstone Projects & Applied Creation'])

class TaskDefIn(BaseModel):
    title: str
    description: Optional[str] = None
    concept_id: Optional[str] = None
    rubric_json: Optional[Dict[str, Any]] = None

class ProjectCreateIn(BaseModel):
    domain_id: str
    title: str
    description: Optional[str] = None
    tasks: Optional[List[TaskDefIn]] = None

class TaskSubmitIn(BaseModel):
    submission_text: Optional[str] = None
    code: Optional[str] = None
    artifact_url: Optional[str] = None
    score: Optional[float] = 1.0
    telemetry: Optional[Dict[str, Any]] = None

@router.get('')
def list_projects(
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(m.Project).filter(m.Project.user_id == current_user.id).all()

@router.post('')
def create_project(
    data: ProjectCreateIn,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks_data = [t.model_dump() for t in data.tasks] if data.tasks else None
    return ProjectEngineService.create_project(
        db=db,
        user_id=current_user.id,
        domain_id=data.domain_id,
        title=data.title,
        description=data.description,
        tasks_def=tasks_data
    )

@router.get('/{project_id}')
def get_project_details(
    project_id: str,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return ProjectEngineService.get_project_details(db, current_user.id, project_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post('/tasks/{task_id}/submit')
def submit_task(
    task_id: str,
    data: TaskSubmitIn,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return ProjectEngineService.submit_task_solution(db, current_user.id, task_id, data.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
