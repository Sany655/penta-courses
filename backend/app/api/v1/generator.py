from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
from backend.app.services.llm_generator import LLMCognitiveGeneratorService

router = APIRouter(prefix='/generator', tags=['LLM Cognitive Generator & AI Teacher'])

class GenerateActivityIn(BaseModel):
    archetype: str
    concept_name: str
    domain_name: Optional[str] = 'Multi-Domain'
    difficulty: Optional[float] = 0.7

class SocraticHintIn(BaseModel):
    concept_name: str
    failure_category: Optional[str] = 'KNOWLEDGE_GAP'
    current_attempt_score: Optional[float] = 0.5

@router.post('/activity')
def generate_activity(
    data: GenerateActivityIn,
    current_user: m.User = Depends(get_current_user)
):
    return LLMCognitiveGeneratorService.generate_activity_payload(
        archetype=data.archetype,
        concept_name=data.concept_name,
        domain_name=data.domain_name or 'Multi-Domain',
        difficulty=data.difficulty or 0.7
    )

@router.post('/socratic-hint')
def generate_socratic_hint(
    data: SocraticHintIn,
    current_user: m.User = Depends(get_current_user)
):
    return LLMCognitiveGeneratorService.generate_socratic_hint(
        concept_name=data.concept_name,
        failure_category=data.failure_category or 'KNOWLEDGE_GAP',
        current_attempt_score=data.current_attempt_score or 0.5
    )

@router.post('/graph-expand/{domain_id}')
def expand_graph(
    domain_id: str,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return LLMCognitiveGeneratorService.expand_domain_graph_candidates(db, domain_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
