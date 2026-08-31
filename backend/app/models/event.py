import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON
from backend.app.core.database import Base

class EventType:
    SESSION_STARTED = 'SESSION_STARTED'
    CONCEPT_OPENED = 'CONCEPT_OPENED'
    RESOURCE_OPENED = 'RESOURCE_OPENED'
    ACTIVITY_STARTED = 'ACTIVITY_STARTED'
    ACTIVITY_COMPLETED = 'ACTIVITY_COMPLETED'
    ACTIVITY_FAILED = 'ACTIVITY_FAILED'
    HINT_REQUESTED = 'HINT_REQUESTED'
    EXPLANATION_REQUESTED = 'EXPLANATION_REQUESTED'
    CONCEPT_REVISITED = 'CONCEPT_REVISITED'
    PROJECT_STARTED = 'PROJECT_STARTED'
    PROJECT_COMPLETED = 'PROJECT_COMPLETED'
    EXPLORATION_CAPTURED = 'EXPLORATION_CAPTURED'
    CONTEXT_SWITCHED = 'CONTEXT_SWITCHED'
    SESSION_ABANDONED = 'SESSION_ABANDONED'

class LearningEvent(Base):
    __tablename__ = 'learning_events'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    session_id = Column(String(36), ForeignKey('learning_sessions.id', ondelete='SET NULL'), nullable=True, index=True)
    event_type = Column(String(50), nullable=False, index=True)
    entity_type = Column(String(50), nullable=False)  # CONCEPT, SKILL, ACTIVITY, PROJECT, DOMAIN
    entity_id = Column(String(36), nullable=False, index=True)
    payload_json = Column(JSON, default=dict, nullable=False)
    device_id = Column(String(255), nullable=True)
    cursor_position = Column(Integer, default=0, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
