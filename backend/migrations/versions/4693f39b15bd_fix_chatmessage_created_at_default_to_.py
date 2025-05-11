"""fix ChatMessage.created_at default to now

Revision ID: 4693f39b15bd
Revises: 6b9b4325395a
Create Date: 2025-05-11 02:51:51.246247

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4693f39b15bd'
down_revision: Union[str, None] = '6b9b4325395a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
