"""create the existing application schema

This baseline uses SQLAlchemy metadata because the project had an existing
schema without a committed Alembic history. It intentionally excludes the
inquiries table, which is added by the following migration.
"""
from alembic import op
from backend.app.core.database import Base
import backend.app.models as models

revision = '20260907_baseline'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    tables = [table for table in Base.metadata.sorted_tables if table.name != 'inquiries']
    Base.metadata.create_all(bind=bind, tables=tables, checkfirst=True)


def downgrade() -> None:
    bind = op.get_bind()
    tables = [table for table in reversed(Base.metadata.sorted_tables) if table.name != 'inquiries']
    Base.metadata.drop_all(bind=bind, tables=tables, checkfirst=True)
