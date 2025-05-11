
from backend.app.db.session import get_db
from backend.app import models

def save_chat_message(chat_id: int, content: str, role: str):
    db = next(get_db())
    message = models.ChatMessage(chat_id=chat_id, content=content, role=role)
    db.add(message)
    db.commit()
    db.refresh(message)
