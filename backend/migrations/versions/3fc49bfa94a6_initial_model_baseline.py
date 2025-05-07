"""Initial model baseline

Revision ID: 3fc49bfa94a6
Revises: 
Create Date: 2025-05-02 13:17:59.301318
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# Revision identifiers
revision: str = '3fc49bfa94a6'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Apply schema changes (SQLite-safe)"""
    # Create memory_ledger table
    op.create_table(
        'memory_ledger',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('context_type', sa.String(), nullable=False),
        sa.Column('related_id', sa.Integer(), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_memory_ledger_context_type', 'memory_ledger', ['context_type'])
    op.create_index('ix_memory_ledger_timestamp', 'memory_ledger', ['timestamp'])

    # Create plugin_executions table
    op.create_table(
        'plugin_executions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('plugin_name', sa.String(), nullable=False),
        sa.Column('input_data', sa.JSON(), nullable=False),
        sa.Column('output_data', sa.JSON(), nullable=True),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_plugin_executions_status', 'plugin_executions', ['status'])
    op.create_index('ix_plugin_executions_timestamp', 'plugin_executions', ['timestamp'])
    op.create_index('ix_plugin_executions_completed_at', 'plugin_executions', ['completed_at'])

    # Create tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('model_used', sa.String(), nullable=False),
        sa.Column('generated_code', sa.Text(), nullable=True),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_tasks_status', 'tasks', ['status'])
    op.create_index('ix_tasks_created_at', 'tasks', ['created_at'])
    op.create_index('ix_tasks_completed_at', 'tasks', ['completed_at'])


def downgrade() -> None:
    """Reverse schema changes"""
    op.drop_index('ix_tasks_completed_at', table_name='tasks')
    op.drop_index('ix_tasks_created_at', table_name='tasks')
    op.drop_index('ix_tasks_status', table_name='tasks')
    op.drop_table('tasks')

    op.drop_index('ix_plugin_executions_completed_at', table_name='plugin_executions')
    op.drop_index('ix_plugin_executions_timestamp', table_name='plugin_executions')
    op.drop_index('ix_plugin_executions_status', table_name='plugin_executions')
    op.drop_table('plugin_executions')

    op.drop_index('ix_memory_ledger_timestamp', table_name='memory_ledger')
    op.drop_index('ix_memory_ledger_context_type', table_name='memory_ledger')
    op.drop_table('memory_ledger')
