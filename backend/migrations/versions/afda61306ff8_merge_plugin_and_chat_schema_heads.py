"""Merge plugin and chat schema heads

Revision ID: afda61306ff8
Revises: 2d69244356e1, 3fc49bfa94a6
Create Date: 2025-05-09 23:45:46.950485

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'afda61306ff8'
down_revision: Union[str, None] = ('2d69244356e1', '3fc49bfa94a6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
