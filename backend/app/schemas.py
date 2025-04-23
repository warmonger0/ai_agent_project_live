from pydantic import BaseModel

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
