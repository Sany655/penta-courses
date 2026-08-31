from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
from backend.app.services.telemetry_service import TelemetryService

router = APIRouter(prefix='/telemetry', tags=['Telemetry & Observability'])

class EventIn(BaseModel):
    event_type: str
    session_id: Optional[str] = None
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    payload: Optional[Dict[str, Any]] = None

@router.post('/events')
def record_event(
    data: EventIn,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return TelemetryService.record_event(
        db=db,
        user_id=current_user.id,
        event_type=data.event_type,
        session_id=data.session_id,
        entity_type=data.entity_type,
        entity_id=data.entity_id,
        payload=data.payload
    )

@router.get('/summary')
def get_telemetry_summary(
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return TelemetryService.get_learner_telemetry_summary(db, current_user.id)
