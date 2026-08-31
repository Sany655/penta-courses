from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class ConceptRelationOut(BaseModel):
    id: str
    from_concept_id: str
    to_concept_id: str
    relation_type: str
    strength: float
    confidence: float
    source: str
    model_config = ConfigDict(from_attributes=True)

class ConceptOut(BaseModel):
    id: str
    domain_id: str
    name: str
    slug: str
    description: Optional[str] = None
    type: str
    difficulty: float
    importance: float
    abstraction_level: int
    estimated_learning_effort: int
    canonical_definition: Optional[str] = None
    common_misconceptions: List[Any] = []
    status: str
    version: str
    model_config = ConfigDict(from_attributes=True)

class SkillOut(BaseModel):
    id: str
    domain_id: str
    name: str
    slug: str
    description: Optional[str] = None
    difficulty: float
    importance: float
    model_config = ConfigDict(from_attributes=True)

class DomainOut(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    version: str
    status: str
    difficulty: str
    is_public: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class DomainGraphOut(BaseModel):
    domain: DomainOut
    concepts: List[ConceptOut]
    skills: List[SkillOut]
    relations: List[ConceptRelationOut]
