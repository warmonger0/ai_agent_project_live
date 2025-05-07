from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import logging
logger = logging.getLogger(__name__)

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

class ChatChoice(BaseModel):
    message: ChatMessage

class ChatResponse(BaseModel):
    choices: list[ChatChoice]

@router.post("/chat", response_model=ChatResponse)
async def chat_with_deepseek(request: ChatRequest):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:11434/api/chat",
                json={
                    "model": "deepseek-coder:latest",
                    "messages": [{"role": m.role, "content": m.content} for m in request.messages],
                    "stream": False,
                },
                timeout=60,
            )

        # Log full response for debugging
        logging.warning("[DeepSeek DEBUG] Raw response from Ollama:\n%s", response.text)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Ollama error: {response.status_code} - {response.text}")

        data = response.json()

        # Defensive validation of expected structure
        if "message" not in data or "content" not in data["message"]:
            raise HTTPException(status_code=500, detail=f"Invalid DeepSeek response structure: {data}")

        return {
            "choices": [
                {
                    "message": {
                        "role": data["message"]["role"],
                        "content": data["message"]["content"],
                    }
                }
            ]
        }

    except Exception as e:
        logging.exception("[DeepSeek ERROR] Exception occurred:")
        raise HTTPException(status_code=500, detail=str(e))
