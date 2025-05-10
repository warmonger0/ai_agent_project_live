# File: backend/app/crud.py

from sqlalchemy.orm import Session
from datetime import datetime

from app import models, schemas


# --- Projects ---
def create_project(db: Session, name: str) -> models.Project:
    db_project = models.Project(name=name)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def get_project(db: Session, project_id: int) -> models.Project | None:
    return db.query(models.Project).filter(models.Project.id == project_id).first()


def get_all_projects(db: Session) -> list[models.Project]:
    return db.query(models.Project).all()


# --- Chats ---
def create_chat(db: Session, project_id: int, title: str | None = None) -> models.Chat:
    db_chat = models.Chat(project_id=project_id, title=title)
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat


def get_chat(db: Session, chat_id: int) -> models.Chat | None:
    return db.query(models.Chat).filter(models.Chat.id == chat_id).first()


def get_chats_for_project(db: Session, project_id: int) -> list[models.Chat]:
    return db.query(models.Chat).filter(models.Chat.project_id == project_id).all()


# --- Chat Messages ---
def create_chat_message(
    db: Session,
    chat_id: int,
    role: str,
    content: str
) -> models.ChatMessage:
    db_msg = models.ChatMessage(
        chat_id=chat_id,
        role=role,
        content=content,
        timestamp=datetime.utcnow(),
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg


def get_messages_for_chat(db: Session, chat_id: int) -> list[models.ChatMessage]:
    return (
        db.query(models.ChatMessage)
        .filter(models.ChatMessage.chat_id == chat_id)
        .order_by(models.ChatMessage.timestamp)
        .all()
    )
