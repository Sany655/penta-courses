import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class UserRole:
    ADMIN = 'ADMIN'
    USER = 'USER'
    GUEST = 'GUEST'
    
    # Aliases for compatibility
    SUPER_ADMIN = 'ADMIN'
    STUDENT = 'USER'

class User(Base):
    __tablename__ = 'users'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    device_sessions = relationship('DeviceSession', back_populates='user', cascade='all, delete-orphan')
    goals = relationship('Goal', back_populates='user', cascade='all, delete-orphan')
    profile = relationship('LearnerProfile', back_populates='user', uselist=False, cascade='all, delete-orphan')
    domain_states = relationship('LearnerDomainState', back_populates='user', cascade='all, delete-orphan')
    concept_states = relationship('LearnerConceptState', back_populates='user', cascade='all, delete-orphan')
    skill_states = relationship('LearnerSkillState', back_populates='user', cascade='all, delete-orphan')
    sessions = relationship('LearningSession', back_populates='user', cascade='all, delete-orphan')
    transactions = relationship('Transaction', back_populates='user', cascade='all, delete-orphan')
    entitlements = relationship('Entitlement', back_populates='user', cascade='all, delete-orphan')
    reset_tokens = relationship('PasswordResetToken', back_populates='user', cascade='all, delete-orphan')

class DeviceSession(Base):
    __tablename__ = 'device_sessions'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    device_id = Column(String(255), nullable=False, index=True)
    device_type = Column(String(50), default='WEB', nullable=False)  # WEB, WINDOWS, ANDROID
    platform = Column(String(100), nullable=True)
    app_version = Column(String(50), nullable=True)
    last_sync = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    user = relationship('User', back_populates='device_sessions')

class PasswordResetToken(Base):
    __tablename__ = 'password_reset_tokens'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    token_hash = Column(String(64), nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    ip_address = Column(String(45), nullable=True)

    user = relationship('User', back_populates='reset_tokens')


class AuthAttempt(Base):
    __tablename__ = 'auth_attempts'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ip_address = Column(String(64), nullable=False, index=True)
    identifier = Column(String(255), nullable=True, index=True)  # normalized email or username
    action = Column(String(50), default='login', nullable=False, index=True)  # 'login', 'forgot-password'
    is_successful = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

