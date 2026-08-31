import os

with open('backend/app/models/commerce.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_mb = """class ModuleBypass(Base):
    __tablename__ = 'module_bypasses'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    module_id = Column(String(36), ForeignKey('modules.id', ondelete='CASCADE'), nullable=False, index=True)
    transaction_id = Column(String(36), ForeignKey('transactions.id', ondelete='SET NULL'), nullable=True)
    status = Column(String(50), default='ACTIVE', nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    module = relationship('Module', back_populates='bypasses')"""

new_mb = """class ModuleBypass(Base):
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

    module = relationship('Module', back_populates='bypasses')"""

code = code.replace(old_mb, new_mb)
with open('backend/app/models/commerce.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated ModuleBypass model in commerce.py!')
