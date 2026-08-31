from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
from backend.app.services.sync_service import SyncService

router = APIRouter(prefix="/sync", tags=["Offline Synchronization"])

class SyncPushIn(BaseModel):
    device_id: str
    events: List[Dict[str, Any]]

@router.post("/push")
def push_offline_events(
    data: SyncPushIn,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Ingest a batch of offline outbox events recorded on a local device."""
    return SyncService.push_offline_events(
        db=db,
        user_id=current_user.id,
        device_id=data.device_id,
        events=data.events
    )

@router.get("/pull")
def pull_state_delta(
    since: Optional[str] = Query(None, description="ISO8601 timestamp of last sync"),
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Pull authoritative server state delta (mastery vectors, entitlements, goals)."""
    return SyncService.pull_state_delta(
        db=db,
        user_id=current_user.id,
        since_timestamp=since
    )
