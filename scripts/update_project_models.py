import os

with open('backend/app/models/session.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_models = """class Project(Base):
    __tablename__ = 'projects'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(Float, default=0.7, nullable=False)
    scope = Column(String(50), default='CAPSTONE', nullable=False)
    success_criteria = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    domain = relationship('Domain', back_populates='projects')
    tasks = relationship('ProjectTask', back_populates='project', cascade='all, delete-orphan')

class ProjectTask(Base):
    __tablename__ = 'project_tasks'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey('projects.id', ondelete='CASCADE'), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    required_concepts = Column(JSON, default=list, nullable=False)
    required_skills = Column(JSON, default=list, nullable=False)
    dependencies = Column(JSON, default=list, nullable=False)

    project = relationship('Project', back_populates='tasks')"""

new_models = """class Project(Base):
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

    project = relationship('Project', back_populates='tasks')"""

code = code.replace(old_models, new_models)
with open('backend/app/models/session.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated Project and ProjectTask models in session.py!')
