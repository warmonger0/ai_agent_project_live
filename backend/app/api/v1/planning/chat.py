from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import logging

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
    logging.warning("[CHAT API] Received message: %s", request.messages)

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:11434/api/chat",
                json={
                    "model": "deepseek-coder:latest",
                    "messages": [m.dict() for m in request.messages],
                    "stream": False,
                },
                timeout=60,
            )

        logging.warning("[CHAT API] Ollama raw response: %s", response.text)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Ollama error: {response.status_code} - {response.text}")

        data = response.json()

        if "message" not in data or "content" not in data["message"]:
            raise HTTPException(status_code=500, detail=f"Malformed DeepSeek response: {data}")

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
        logging.exception("[CHAT API] Exception during Ollama call")
        raise HTTPException(status_code=500, detail=str(e))
