import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class GoalType:
    EXPLORATION = 'EXPLORATION'
    COMPETENCE = 'COMPETENCE'
    PROJECT = 'PROJECT'
    PROFESSIONAL = 'PROFESSIONAL'
    ACADEMIC = 'ACADEMIC'
    EXPERTISE = 'EXPERTISE'

class Goal(Base):
    __tablename__ = 'goals'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    goal_type = Column(String(50), default=GoalType.COMPETENCE, nullable=False)
    target_level = Column(String(50), default='L3', nullable=False)  # L0 to L6
    target_concept_ids = Column(JSON, default=list, nullable=True)
    target_skill_ids = Column(JSON, default=list, nullable=True)
    progress = Column(Float, default=0.0, nullable=False)
    priority = Column(Integer, default=1, nullable=False)
    deadline = Column(DateTime, nullable=True)
    status = Column(String(50), default='ACTIVE', nullable=False)  # ACTIVE, PAUSED, COMPLETED, ABANDONED
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship('User', back_populates='goals')
    domain = relationship('Domain', back_populates='goals')

class LearnerProfile(Base):
    __tablename__ = 'learner_profiles'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False, index=True)
    learning_mode = Column(String(50), default='BALANCED', nullable=False)  # EXPLORATIVE, STRUCTURED, FAST_PACED
    exploration_tendency = Column(Float, default=0.5, nullable=False)
    persistence = Column(Float, default=0.5, nullable=False)
    deep_focus_capacity = Column(Float, default=0.5, nullable=False)
    context_switch_sensitivity = Column(Float, default=0.5, nullable=False)
    feedback_preference = Column(String(50), default='DETAILED', nullable=False)
    explanation_preference = Column(String(50), default='SOCRATIC', nullable=False)
    challenge_preference = Column(Float, default=0.7, nullable=False)
    project_preference = Column(Float, default=0.8, nullable=False)
    traits_json = Column(JSON, default=dict, nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship('User', back_populates='profile')

class LearnerDomainState(Base):
    __tablename__ = 'learner_domain_states'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=False, index=True)
    level = Column(String(50), default='L0', nullable=False)  # L0 Curious, L1 Orientation, L2 Foundational, L3 Working, L4 Independent, L5 Advanced, L6 Expert
    overall_mastery = Column(Float, default=0.0, nullable=False)
    confidence = Column(Float, default=0.1, nullable=False)
    momentum = Column(Float, default=0.0, nullable=False)
    engagement = Column(Float, default=0.0, nullable=False)
    time_invested_minutes = Column(Integer, default=0, nullable=False)
    last_active = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship('User', back_populates='domain_states')

class LearnerConceptState(Base):
    __tablename__ = 'learner_concept_states'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='CASCADE'), nullable=False, index=True)

    mastery = Column(Float, nullable=True)  # NULL or float for UNKNOWN vs WEAK distinction
    confidence = Column(Float, default=0.0, nullable=False)

    recall_strength = Column(Float, default=0.0, nullable=False)
    explanation_strength = Column(Float, default=0.0, nullable=False)
    application_strength = Column(Float, default=0.0, nullable=False)
    implementation_strength = Column(Float, default=0.0, nullable=False)
    creation_strength = Column(Float, default=0.0, nullable=False)

    attempt_count = Column(Integer, default=0, nullable=False)
    success_count = Column(Integer, default=0, nullable=False)
    failure_count = Column(Integer, default=0, nullable=False)

    forgetting_rate = Column(Float, default=0.05, nullable=False)
    review_due = Column(DateTime, nullable=True)

    first_seen = Column(DateTime, nullable=True)
    last_seen = Column(DateTime, nullable=True)
    last_success = Column(DateTime, nullable=True)
    last_failure = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship('User', back_populates='concept_states')

class LearnerSkillState(Base):
    __tablename__ = 'learner_skill_states'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    skill_id = Column(String(36), ForeignKey('skills.id', ondelete='CASCADE'), nullable=False, index=True)

    mastery = Column(Float, default=0.0, nullable=False)
    confidence = Column(Float, default=0.0, nullable=False)
    attempt_count = Column(Integer, default=0, nullable=False)
    success_count = Column(Integer, default=0, nullable=False)
    failure_count = Column(Integer, default=0, nullable=False)
    last_success = Column(DateTime, nullable=True)
    last_failure = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship('User', back_populates='skill_states')

class ExplorationItem(Base):
    __tablename__ = 'exploration_items'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    domain = Column(String(255), nullable=True)
    reason = Column(Text, nullable=True)
    interest_score = Column(Float, default=0.5, nullable=False)
    times_mentioned = Column(Integer, default=1, nullable=False)
    times_revisited = Column(Integer, default=0, nullable=False)
    status = Column(String(50), default='CAPTURED', nullable=False)  # CAPTURED, PARKED, EXPLORING, PROMOTED, DISMISSED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    last_revisited = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
