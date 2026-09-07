"""add persistent inquiries

Revision ID: 20260907_add_inquiries
Revises: 20260907_baseline
"""
from alembic import op
import sqlalchemy as sa

revision = '20260907_add_inquiries'
down_revision = '20260907_baseline'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'inquiries',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('company', sa.String(length=255), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_inquiries_user_id', 'inquiries', ['user_id'])
    op.create_index('ix_inquiries_email', 'inquiries', ['email'])
    op.create_index('ix_inquiries_status', 'inquiries', ['status'])


def downgrade() -> None:
    op.drop_index('ix_inquiries_status', table_name='inquiries')
    op.drop_index('ix_inquiries_email', table_name='inquiries')
    op.drop_index('ix_inquiries_user_id', table_name='inquiries')
    op.drop_table('inquiries')
