import os

with open('backend/app/schemas/recommendation.py', 'r', encoding='utf-8') as f:
    schema_code = f.read()

new_schema = """from pydantic import BaseModel
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
"""

with open('backend/app/schemas/recommendation.py', 'w', encoding='utf-8') as f:
    f.write(new_schema)

with open('backend/app/services/commerce_service.py', 'r', encoding='utf-8') as f:
    comm_code = f.read()

comm_code = comm_code.replace('m.Course.status == "PUBLISHED"', 'm.Course.is_published == True')

with open('backend/app/services/commerce_service.py', 'w', encoding='utf-8') as f:
    f.write(comm_code)

print('Updated RecommendationOut schema and Course query!')
