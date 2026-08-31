from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class RecommendationTarget(BaseModel):
    type: str  # concept, skill, project
    id: str
    name: Optional[str] = None

class RecommendationActivity(BaseModel):
    type: str  # PROBLEM, SIMULATION, RECALL, etc.
    archetype: str  # sequence_engine, causal_graph, etc.
    difficulty: float
    activity_id: Optional[str] = None
    data_json: Optional[Dict[str, Any]] = None

class RecommendationOut(BaseModel):
    recommendation_id: Optional[str] = None
    policy_version: Optional[str] = None
    action: str  # LEARN, EXPLAIN, PRACTICE, IMPLEMENT, BUILD, REVIEW, ADVANCE
    target: RecommendationTarget
    activity: RecommendationActivity
    estimated_minutes: int
    confidence: float
    reasons: List[str]
    reason_codes: Optional[List[str]] = None
    feature_values: Optional[Dict[str, Any]] = None
