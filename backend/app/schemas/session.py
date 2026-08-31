from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime

class ActivityOut(BaseModel):
    id: str
    concept_id: Optional[str] = None
    skill_id: Optional[str] = None
    title: str
    activity_type: str
    archetype: str
    difficulty: float
    estimated_minutes: int
    instructions: Optional[str] = None
    data_json: Dict[str, Any] = {}
    rubric_json: List[Dict[str, Any]] = []
    model_config = ConfigDict(from_attributes=True)

class AttemptSubmit(BaseModel):
    activity_id: str
    answer_json: Dict[str, Any]
    solution_json: Optional[Dict[str, Any]] = {}
    time_taken_seconds: int = 30
    self_confidence: float = 0.8
    telemetry_json: Optional[Dict[str, Any]] = {}

class AttemptOut(BaseModel):
    id: str
    session_id: str
    activity_id: str
    result: str
    score: float
    error_type: Optional[str] = None
    time_taken_seconds: int
    model_config = ConfigDict(from_attributes=True)

class SessionStart(BaseModel):
    domain_id: Optional[str] = None
    goal_id: Optional[str] = None

class SessionOut(BaseModel):
    id: str
    user_id: str
    domain_id: Optional[str] = None
    goal_id: Optional[str] = None
    status: str
    started_at: datetime
    model_config = ConfigDict(from_attributes=True)
