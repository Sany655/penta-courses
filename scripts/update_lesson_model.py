import os

with open('backend/app/models/course.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_lesson = """class Lesson(Base):
    __tablename__ = 'lessons'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    module_id = Column(String(36), ForeignKey('modules.id', ondelete='CASCADE'), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    order_index = Column(Integer, default=0, nullable=False)
    duration_minutes = Column(Integer, default=15, nullable=False)
    content_blocks = Column(JSON, default=list, nullable=False)

    module = relationship('Module', back_populates='lessons')
    concept_mappings = relationship('LessonConceptMap', back_populates='lesson', cascade='all, delete-orphan')"""

new_lesson = """class Lesson(Base):
    __tablename__ = 'lessons'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    module_id = Column(String(36), ForeignKey('modules.id', ondelete='CASCADE'), nullable=False, index=True)
    concept_id = Column(String(36), ForeignKey('concepts.id', ondelete='SET NULL'), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    order_index = Column(Integer, default=0, nullable=False)
    duration_minutes = Column(Integer, default=15, nullable=False)
    content_blocks = Column(JSON, default=list, nullable=False)

    module = relationship('Module', back_populates='lessons')
    concept_mappings = relationship('LessonConceptMap', back_populates='lesson', cascade='all, delete-orphan')"""

code = code.replace(old_lesson, new_lesson)
with open('backend/app/models/course.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated Lesson model in course.py with concept_id!')
