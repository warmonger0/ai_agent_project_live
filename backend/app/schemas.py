# File: backend/app/schemas.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Task Schemas ---
class TaskRequest(BaseModel):
    description: str

class TaskResponse(BaseModel):
    task_id: int
    status: str
    generated_code: str

class TaskStatusResponse(BaseModel):
    task_id: int
    description: str
    model_used: str
    generated_code: str
    status: str

class TaskSummaryResponse(BaseModel):
    task_id: int
    description: str
    status: str

# --- Chat Message Schemas ---
class ChatMessageBase(BaseModel):
    content: str
    role: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    chat_id: int
    created_at: datetime

    class Config:
        from_attributes = True  # replaced orm_mode

# --- Chat Schemas ---
class ChatBase(BaseModel):
    title: Optional[str] = None

class ChatCreate(ChatBase):
    pass

class Chat(ChatBase):
    id: int
    project_id: int
    created_at: datetime
    messages: List[ChatMessage] = []

    class Config:
        from_attributes = True  # replaced orm_mode

# --- Project Schemas ---
class ProjectBase(BaseModel):
    name: str

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    created_at: datetime
    chats: List[Chat] = []

    class Config:
        from_attributes = True  # replaced orm_mode
