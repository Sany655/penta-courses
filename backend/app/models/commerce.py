import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, JSON, Float
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Product(Base):
    __tablename__ = 'products'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    item_type = Column(String(50), nullable=False)  # COURSE, MODULE_BYPASS, CERTIFICATE, SUBSCRIPTION
    item_id = Column(String(36), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    price_in_cents = Column(Integer, default=0, nullable=False)
    currency = Column(String(10), default='USD', nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    provider = Column(String(50), default='STRIPE', nullable=False)  # STRIPE, BKASH
    transaction_ref = Column(String(255), unique=True, index=True, nullable=False)
    amount_in_cents = Column(Integer, nullable=False)
    currency = Column(String(10), default='USD', nullable=False)
    status = Column(String(50), default='PENDING', nullable=False)  # PENDING, SUCCESS, FAILED, REFUNDED
    item_type = Column(String(50), nullable=False)
    item_id = Column(String(36), nullable=False)
    metadata_json = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship('User', back_populates='transactions')

class Entitlement(Base):
    __tablename__ = 'entitlements'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    item_type = Column(String(50), nullable=False)  # COURSE, MODULE_BYPASS, CERTIFICATE
    item_id = Column(String(36), nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    granted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    expires_at = Column(DateTime, nullable=True)

    user = relationship('User', back_populates='entitlements')

class Enrollment(Base):
    __tablename__ = 'enrollments'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    course_id = Column(String(36), ForeignKey('courses.id', ondelete='CASCADE'), nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    enrolled_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    course = relationship('Course', back_populates='enrollments')

class ModuleBypass(Base):
    __tablename__ = 'module_bypasses'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    module_id = Column(String(36), ForeignKey('modules.id', ondelete='CASCADE'), nullable=False, index=True)
    bypass_type = Column(String(50), default='EXAM_PASSED', nullable=False)
    score = Column(Float, default=1.0, nullable=False)
    transaction_id = Column(String(36), ForeignKey('transactions.id', ondelete='SET NULL'), nullable=True)
    status = Column(String(50), default='ACTIVE', nullable=False)
    unlocked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    module = relationship('Module', back_populates='bypasses')

class Certificate(Base):
    __tablename__ = 'certificates'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=True, index=True)
    course_id = Column(String(36), ForeignKey('courses.id', ondelete='CASCADE'), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    verification_hash = Column(String(255), unique=True, index=True, nullable=False)
    score = Column(Float, default=1.0, nullable=False)
    issued_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

class AdminAuditLog(Base):
    __tablename__ = 'admin_audit_logs'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    admin_id = Column(String(36), ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(36), nullable=True)
    details_json = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
