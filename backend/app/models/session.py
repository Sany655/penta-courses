import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class EvidenceType:
    RECALL = 'RECALL'
    EXPLANATION = 'EXPLANATION'
    PROBLEM_SOLVING = 'PROBLEM_SOLVING'
    IMPLEMENTATION = 'IMPLEMENTATION'
    PROJECT = 'PROJECT'
    TEACHING = 'TEACHING'
    DEBUGGING = 'DEBUGGING'
    TRANSFER = 'TRANSFER'

class FailureCategory:
    KNOWLEDGE_GAP = 'KNOWLEDGE_GAP'
    PREREQUISITE_GAP = 'PREREQUISITE_GAP'
    MISCONCEPTION = 'MISCONCEPTION'
    RECALL_FAILURE = 'RECALL_FAILURE'
    APPLICATION_FAILURE = 'APPLICATION_FAILURE'
    PROCEDURAL_FAILURE = 'PROCEDURAL_FAILURE'
    REASONING_FAILURE = 'REASONING_FAILURE'
    EXECUTION_FAILURE = 'EXECUTION_FAILURE'
    ATTENTION_FAILURE = 'ATTENTION_FAILURE'
    CONTEXT_FAILURE = 'CONTEXT_FAILURE'

class LearningSession(Base):
    __tablename__ = 'learning_sessions'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='SET NULL'), nullable=True, index=True)
    goal_id = Column(String(36), ForeignKey('goals.id', ondelete='SET NULL'), nullable=True, index=True)
    current_mission_id = Column(String(36), nullable=True)
    status = Column(String(50), default='ACTIVE', nullable=False)  # ACTIVE, PAUSED, COMPLETED, ABANDONED
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)

    user = relationship('User', back_populates='sessions')
    attempts = relationship('Attempt', back_populates='session', cascade='all, delete-orphan')

class Activity(Base):
    __tablename__ = 'activities'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='CASCADE'), nullable=True, index=True)
    skill_id = Column(String(36), ForeignKey('skills.id', ondelete='CASCADE'), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    activity_type = Column(String(50), default='PRACTICE', nullable=False)  # READ, WATCH, RECALL, EXPLAIN, QUIZ, PROBLEM, CODING, SIMULATION, DEBUG, COMPARE, IMPLEMENT, BUILD, TEACH
    archetype = Column(String(50), default='sequence_engine', nullable=False)  # sequence_engine, causal_graph, variable_sandbox, spatial_canvas, comparative_matrix, dialectical_builder, taxonomy_sorter
    difficulty = Column(Float, default=0.5, nullable=False)
    estimated_minutes = Column(Integer, default=15, nullable=False)
    instructions = Column(Text, nullable=True)
    data_json = Column(JSON, default=dict, nullable=False)
    rubric_json = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    concept = relationship('Concept', back_populates='activities')
    attempts = relationship('Attempt', back_populates='activity', cascade='all, delete-orphan')

class Attempt(Base):
    __tablename__ = 'attempts'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey('learning_sessions.id', ondelete='CASCADE'), nullable=False, index=True)
    activity_id = Column(String(36), ForeignKey('activities.id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    result = Column(String(50), default='PENDING', nullable=False)  # PASS, FAIL, PARTIAL, PENDING
    score = Column(Float, default=0.0, nullable=False)  # 0.0 to 1.0
    answer_json = Column(JSON, default=dict, nullable=False)
    solution_json = Column(JSON, default=dict, nullable=False)
    error_type = Column(String(100), nullable=True)
    hint_count = Column(Integer, default=0, nullable=False)
    time_taken_seconds = Column(Integer, default=0, nullable=False)
    self_confidence = Column(Float, default=0.5, nullable=False)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)

    session = relationship('LearningSession', back_populates='attempts')
    activity = relationship('Activity', back_populates='attempts')
    evidences = relationship('LearningEvidence', back_populates='attempt', cascade='all, delete-orphan')
    failure_events = relationship('FailureEvent', back_populates='attempt', cascade='all, delete-orphan')

class LearningEvidence(Base):
    __tablename__ = 'learning_evidences'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='CASCADE'), nullable=True, index=True)
    skill_id = Column(String(36), ForeignKey('skills.id', ondelete='CASCADE'), nullable=True, index=True)
    activity_id = Column(String(36), ForeignKey('activities.id', ondelete='SET NULL'), nullable=True, index=True)
    session_id = Column(String(36), ForeignKey('learning_sessions.id', ondelete='SET NULL'), nullable=True, index=True)
    attempt_id = Column(String(36), ForeignKey('attempts.id', ondelete='SET NULL'), nullable=True, index=True)
    evidence_type = Column(String(50), default=EvidenceType.PROBLEM_SOLVING, nullable=False)
    score = Column(Float, default=1.0, nullable=False)  # 0.0 to 1.0
    quality = Column(Float, default=1.0, nullable=False)  # 0.0 to 1.0
    confidence_reported = Column(Float, default=0.8, nullable=False)
    time_taken = Column(Integer, default=0, nullable=False)
    telemetry_json = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    attempt = relationship('Attempt', back_populates='evidences')

class FailureEvent(Base):
    __tablename__ = 'failure_events'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey('learning_sessions.id', ondelete='CASCADE'), nullable=True, index=True)
    activity_id = Column(String(36), ForeignKey('activities.id', ondelete='SET NULL'), nullable=True, index=True)
    attempt_id = Column(String(36), ForeignKey('attempts.id', ondelete='CASCADE'), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='SET NULL'), nullable=True, index=True)
    category = Column(String(50), default=FailureCategory.KNOWLEDGE_GAP, nullable=False)
    subcategory = Column(String(100), nullable=True)
    severity = Column(Float, default=0.5, nullable=False)  # 0.0 to 1.0
    diagnosis_confidence = Column(Float, default=0.8, nullable=False)
    resolved = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    attempt = relationship('Attempt', back_populates='failure_events')

class Project(Base):
    __tablename__ = 'projects'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=True, index=True)
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    difficulty = Column(Float, default=0.7, nullable=False)
    scope = Column(String(50), default='CAPSTONE', nullable=False)
    status = Column(String(50), default='ACTIVE', nullable=False)
    success_criteria = Column(JSON, default=list, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    domain = relationship('Domain', back_populates='projects')
    tasks = relationship('ProjectTask', back_populates='project', cascade='all, delete-orphan')

class ProjectTask(Base):
    __tablename__ = 'project_tasks'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey('projects.id', ondelete='CASCADE'), nullable=False, index=True)
    concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='SET NULL'), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    task_order = Column(Integer, default=1, nullable=False)
    status = Column(String(50), default='PENDING', nullable=False)
    score = Column(Float, nullable=True)
    rubric_json = Column(JSON, default=dict, nullable=False)
    submission_json = Column(JSON, default=dict, nullable=False)
    required_concepts = Column(JSON, default=list, nullable=False)
    required_skills = Column(JSON, default=list, nullable=False)
    dependencies = Column(JSON, default=list, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    project = relationship('Project', back_populates='tasks')


class RecommendationAudit(Base):
    __tablename__ = 'recommendation_audits'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    session_id = Column(String(36), ForeignKey('learning_sessions.id', ondelete='SET NULL'), nullable=True, index=True)
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=False, index=True)
    concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='CASCADE'), nullable=False, index=True)
    activity_id = Column(String(36), ForeignKey('activities.id', ondelete='SET NULL'), nullable=True, index=True)
    policy_version = Column(String(50), default='v1.0.0-10factor', nullable=False, index=True)
    selected_action = Column(String(50), nullable=False)
    composite_score = Column(Float, nullable=False)
    calibrated_difficulty = Column(Float, default=0.5, nullable=False)
    feature_values = Column(JSON, default=dict, nullable=False)
    weights = Column(JSON, default=dict, nullable=False)
    reason_codes = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
