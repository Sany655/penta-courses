import os

with open('backend/app/models/session.py', 'r', encoding='utf-8') as f:
    code = f.read()

model_snippet = """

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
"""

if 'class RecommendationAudit' not in code:
    code += model_snippet
    with open('backend/app/models/session.py', 'w', encoding='utf-8') as f:
        f.write(code)
    print('Added RecommendationAudit to session.py!')
else:
    print('RecommendationAudit already exists.')
