from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from typing import List

from backend.app import crud, models, schemas
from backend.app.db.session import get_db
from backend.app.routes.deepseek_routes import query_deepseek  # ✅ Import DeepSeek helper

router = APIRouter(prefix="/chat", tags=["chat"])

# ──────────────── Project Endpoints ────────────────

@router.post("/projects/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_project(db=db, name=project.name)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Project with this name already exists.")

@router.get("/projects/", response_model=List[schemas.Project])
def read_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).options(selectinload(models.Project.chats)).all()

@router.get("/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(models.Project)\
        .options(selectinload(models.Project.chats))\
        .filter(models.Project.id == project_id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.patch("/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, update: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = crud.get_project(db=db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    if update.understanding is not None:
        db_project.understanding = update.understanding

    db.commit()
    db.refresh(db_project)
    return db_project

# ──────────────── Chat Endpoints ────────────────

@router.post("/projects/{project_id}/chats/", response_model=schemas.Chat)
def create_chat(project_id: int, chat: schemas.ChatCreate, db: Session = Depends(get_db)):
    if not crud.get_project(db=db, project_id=project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.create_chat(db=db, project_id=project_id, title=chat.title)

@router.get("/projects/{project_id}/chats/", response_model=List[schemas.Chat])
def read_chats(project_id: int, db: Session = Depends(get_db)):
    if not crud.get_project(db=db, project_id=project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.get_chats_for_project(db=db, project_id=project_id)

@router.get("/chats/{chat_id}", response_model=schemas.Chat)
def read_chat(chat_id: int, db: Session = Depends(get_db)):
    db_chat = crud.get_chat(db=db, chat_id=chat_id)
    if db_chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    return db_chat

# ──────────────── Message Endpoints ────────────────

@router.post("/chats/{chat_id}/messages/", response_model=schemas.ChatMessage)
def create_message(chat_id: int, message: schemas.ChatMessageCreate, db: Session = Depends(get_db)):
    # ✅ Confirm chat exists
    if not crud.get_chat(db=db, chat_id=chat_id):
        raise HTTPException(status_code=404, detail="Chat not found")

    # ✅ Store user message
    user_msg = crud.create_chat_message(
        db=db, chat_id=chat_id, role="user", content=message.content
    )

    # ✅ Collect full chat history
    messages = crud.get_messages_for_chat(db=db, chat_id=chat_id)
    history = [{"role": m.role, "content": m.content} for m in messages]

    # ✅ Query DeepSeek for response
    try:
        reply = query_deepseek(history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DeepSeek error: {e}")

    # ✅ Save assistant message
    assistant_msg = crud.create_chat_message(
        db=db, chat_id=chat_id, role="assistant", content=reply
    )

    # ✅ Return assistant message
    return assistant_msg

@router.get("/chats/{chat_id}/messages/", response_model=List[schemas.ChatMessage])
def read_messages(chat_id: int, db: Session = Depends(get_db)):
    if not crud.get_chat(db=db, chat_id=chat_id):
        raise HTTPException(status_code=404, detail="Chat not found")
    return crud.get_messages_for_chat(db=db, chat_id=chat_id)
