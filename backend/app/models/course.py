import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Course(Base):
    __tablename__ = 'courses'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='SET NULL'), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), default='GENERAL', nullable=False)
    difficulty = Column(String(50), default='Intermediate', nullable=False)
    price_in_cents = Column(Integer, default=0, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    instructor_name = Column(String(255), default='System Faculty', nullable=False)
    thumbnail_url = Column(String(1024), nullable=True)
    stats_json = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    modules = relationship('Module', back_populates='course', cascade='all, delete-orphan', order_by='Module.order_index')
    enrollments = relationship('Enrollment', back_populates='course', cascade='all, delete-orphan')

class Module(Base):
    __tablename__ = 'modules'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(36), ForeignKey('courses.id', ondelete='CASCADE'), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    order_index = Column(Integer, default=0, nullable=False)
    bypass_fee_in_cents = Column(Integer, default=299, nullable=False)

    course = relationship('Course', back_populates='modules')
    lessons = relationship('Lesson', back_populates='module', cascade='all, delete-orphan', order_by='Lesson.order_index')
    bypasses = relationship('ModuleBypass', back_populates='module', cascade='all, delete-orphan')

class Lesson(Base):
    __tablename__ = 'lessons'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    module_id = Column(String(36), ForeignKey('modules.id', ondelete='CASCADE'), nullable=False, index=True)
    concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='SET NULL'), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    order_index = Column(Integer, default=0, nullable=False)
    duration_minutes = Column(Integer, default=15, nullable=False)
    content_blocks = Column(JSON, default=list, nullable=False)

    module = relationship('Module', back_populates='lessons')
    concept_mappings = relationship('LessonConceptMap', back_populates='lesson', cascade='all, delete-orphan')

class CourseDomainMap(Base):
    __tablename__ = 'course_domain_maps'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(36), ForeignKey('courses.id', ondelete='CASCADE'), nullable=False, index=True)
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=False, index=True)

class LessonConceptMap(Base):
    __tablename__ = 'lesson_concept_maps'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lesson_id = Column(String(36), ForeignKey('lessons.id', ondelete='CASCADE'), nullable=False, index=True)
    concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='CASCADE'), nullable=False, index=True)
    contribution_weight = Column(Float, default=1.0, nullable=False)

    lesson = relationship('Lesson', back_populates='concept_mappings')
