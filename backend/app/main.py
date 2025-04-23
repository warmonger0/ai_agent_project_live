from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ ADD THIS
from backend.app.controllers import health_controller, task_controller

app = FastAPI()

# ✅ ADD CORS MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development (lock down later if needed)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach routers
app.include_router(health_controller.router)
app.include_router(task_controller.router)

@app.get("/")
async def root():
    return {"message": "Local AI Agent Brain Running"}
