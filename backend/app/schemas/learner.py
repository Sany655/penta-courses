from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime

class GoalCreate(BaseModel):
    domain_id: str
    title: str
    description: Optional[str] = None
    goal_type: Optional[str] = 'COMPETENCE'
    target_level: Optional[str] = 'L3'
    priority: Optional[int] = 1

class GoalOut(GoalCreate):
    id: str
    user_id: str
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class LearnerProfileOut(BaseModel):
    learning_mode: str
    exploration_tendency: float
    persistence: float
    deep_focus_capacity: float
    context_switch_sensitivity: float
    feedback_preference: str
    explanation_preference: str
    challenge_preference: float
    project_preference: float
    traits_json: Dict[str, Any] = {}
    model_config = ConfigDict(from_attributes=True)

class LearnerDomainStateOut(BaseModel):
    domain_id: str
    level: str
    overall_mastery: float
    confidence: float
    momentum: float
    engagement: float
    time_invested_minutes: int
    model_config = ConfigDict(from_attributes=True)

class LearnerConceptStateOut(BaseModel):
    concept_id: str
    mastery: Optional[float] = None
    confidence: float
    recall_strength: float
    explanation_strength: float
    application_strength: float
    implementation_strength: float
    creation_strength: float
    attempt_count: int
    success_count: int
    failure_count: int
    forgetting_rate: float
    review_due: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
