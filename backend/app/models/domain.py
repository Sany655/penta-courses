import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class ConceptRelationType:
    REQUIRED_PREREQUISITE = 'REQUIRED_PREREQUISITE'
    HELPFUL_PREREQUISITE = 'HELPFUL_PREREQUISITE'
    RELATED = 'RELATED'
    GENERALIZES = 'GENERALIZES'
    SPECIALIZES = 'SPECIALIZES'
    PART_OF = 'PART_OF'
    CONTRASTS_WITH = 'CONTRASTS_WITH'
    ALTERNATIVE_TO = 'ALTERNATIVE_TO'

class ConceptType:
    FOUNDATION = 'FOUNDATION'
    CONCEPT = 'CONCEPT'
    THEORY = 'THEORY'
    TECHNIQUE = 'TECHNIQUE'
    ALGORITHM = 'ALGORITHM'
    PRINCIPLE = 'PRINCIPLE'
    PATTERN = 'PATTERN'
    TERMINOLOGY = 'TERMINOLOGY'

class Domain(Base):
    __tablename__ = 'domains'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False, unique=True, index=True)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    version = Column(String(50), default='1.0.0', nullable=False)
    status = Column(String(50), default='PUBLISHED', nullable=False)  # DRAFT, REVIEWED, PUBLISHED
    difficulty = Column(String(50), default='Intermediate', nullable=False)
    is_public = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    concepts = relationship('Concept', back_populates='domain', cascade='all, delete-orphan')
    skills = relationship('Skill', back_populates='domain', cascade='all, delete-orphan')
    projects = relationship('Project', back_populates='domain', cascade='all, delete-orphan')
    goals = relationship('Goal', back_populates='domain', cascade='all, delete-orphan')

class Concept(Base):
    __tablename__ = 'concepts'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    type = Column(String(50), default=ConceptType.CONCEPT, nullable=False)
    difficulty = Column(Float, default=0.5, nullable=False)  # 0.0 to 1.0
    importance = Column(Float, default=0.5, nullable=False)  # 0.0 to 1.0
    abstraction_level = Column(Integer, default=1, nullable=False)
    estimated_learning_effort = Column(Integer, default=30, nullable=False)  # in minutes
    canonical_definition = Column(Text, nullable=True)
    common_misconceptions = Column(JSON, default=list, nullable=False)
    status = Column(String(50), default='PUBLISHED', nullable=False)
    version = Column(String(50), default='1.0.0', nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    domain = relationship('Domain', back_populates='concepts')
    activities = relationship('Activity', back_populates='concept', cascade='all, delete-orphan')
    outgoing_relations = relationship('ConceptRelation', foreign_keys='ConceptRelation.from_concept_id', back_populates='from_concept', cascade='all, delete-orphan')
    incoming_relations = relationship('ConceptRelation', foreign_keys='ConceptRelation.to_concept_id', back_populates='to_concept', cascade='all, delete-orphan')
    skills = relationship('ConceptSkill', back_populates='concept', cascade='all, delete-orphan')

class Skill(Base):
    __tablename__ = 'skills'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    difficulty = Column(Float, default=0.5, nullable=False)
    importance = Column(Float, default=0.5, nullable=False)
    status = Column(String(50), default='PUBLISHED', nullable=False)
    version = Column(String(50), default='1.0.0', nullable=False)

    domain = relationship('Domain', back_populates='skills')
    concepts = relationship('ConceptSkill', back_populates='skill', cascade='all, delete-orphan')

class ConceptRelation(Base):
    __tablename__ = 'concept_relations'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    from_concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='CASCADE'), nullable=False, index=True)
    to_concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='CASCADE'), nullable=False, index=True)
    relation_type = Column(String(50), default=ConceptRelationType.REQUIRED_PREREQUISITE, nullable=False)
    strength = Column(Float, default=1.0, nullable=False)
    confidence = Column(Float, default=1.0, nullable=False)
    source = Column(String(100), default='HUMAN', nullable=False)  # HUMAN, AI
    source_type = Column(String(100), default='CURATOR', nullable=False)

    from_concept = relationship('Concept', foreign_keys=[from_concept_id], back_populates='outgoing_relations')
    to_concept = relationship('Concept', foreign_keys=[to_concept_id], back_populates='incoming_relations')

class SkillRelation(Base):
    __tablename__ = 'skill_relations'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    from_skill_id = Column(String(36), ForeignKey('skills.id', ondelete='CASCADE'), nullable=False, index=True)
    to_skill_id = Column(String(36), ForeignKey('skills.id', ondelete='CASCADE'), nullable=False, index=True)
    relation_type = Column(String(50), default='PREREQUISITE', nullable=False)
    strength = Column(Float, default=1.0, nullable=False)

class ConceptSkill(Base):
    __tablename__ = 'concept_skills'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='CASCADE'), nullable=False, index=True)
    skill_id = Column(String(36), ForeignKey('skills.id', ondelete='CASCADE'), nullable=False, index=True)
    weight = Column(Float, default=1.0, nullable=False)

    concept = relationship('Concept', back_populates='skills')
    skill = relationship('Skill', back_populates='concepts')

class Resource(Base):
    __tablename__ = 'resources'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    source = Column(String(255), nullable=True)
    url = Column(String(1024), nullable=True)
    resource_type = Column(String(50), default='ARTICLE', nullable=False)  # BOOK, ARTICLE, PAPER, VIDEO, DOCS
    quality_score = Column(Float, default=0.8, nullable=False)
    difficulty = Column(Float, default=0.5, nullable=False)
    language = Column(String(10), default='en', nullable=False)
    metadata_json = Column(JSON, default=dict, nullable=False)

    concepts = relationship('ResourceConcept', back_populates='resource', cascade='all, delete-orphan')

class ResourceConcept(Base):
    __tablename__ = 'resource_concepts'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resource_id = Column(String(36), ForeignKey('resources.id', ondelete='CASCADE'), nullable=False, index=True)
    concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='CASCADE'), nullable=False, index=True)

    resource = relationship('Resource', back_populates='concepts')
