import os

with open('backend/app/models/learner.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_goal = """class Goal(Base):
    __tablename__ = 'goals'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    domain_id = Column(String(36), ForeignKey('domains.id', ondelete='CASCADE'), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    goal_type = Column(String(50), default=GoalType.COMPETENCE, nullable=False)
    target_level = Column(String(50), default='L3', nullable=False)  # L0 to L6
    priority = Column(Integer, default=1, nullable=False)
    deadline = Column(DateTime, nullable=True)
    status = Column(String(50), default='ACTIVE', nullable=False)  # ACTIVE, PAUSED, COMPLETED, ABANDONED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))"""

new_goal = """class Goal(Base):
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
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))"""

code = code.replace(old_goal, new_goal)
with open('backend/app/models/learner.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated Goal model with target_concept_ids and progress!')
