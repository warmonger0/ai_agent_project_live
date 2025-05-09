from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx
import logging

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    stream: bool = False

@router.post("/chat")
async def chat_with_deepseek(request: Request):
    try:
        body = await request.json()
        messages = body.get("messages", [])
        stream = body.get("stream", False)

        logging.warning("[CHAT] Request payload: %s", body)

        # STREAM MODE
        if stream:
            async def stream_gen():
                async with httpx.AsyncClient(timeout=None) as client:
                    async with client.stream(
                        "POST",
                        "http://localhost:11434/api/chat",
                        json={
                            "model": "deepseek-coder:latest",
                            "messages": messages,
                            "stream": True,
                        },
                    ) as resp:
                        if resp.status_code != 200:
                            text = await resp.aread()
                            raise HTTPException(status_code=resp.status_code, detail=text.decode())

                        async for chunk in resp.aiter_text():
                            yield chunk

            return StreamingResponse(stream_gen(), media_type="text/plain")

        # NON-STREAM MODE
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:11434/api/chat",
                json={
                    "model": "deepseek-coder:latest",
                    "messages": messages,
                    "stream": False,
                },
                timeout=60,
            )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Ollama error: {response.status_code} - {response.text}")

        data = response.json()

        if "message" not in data or "content" not in data["message"]:
            raise HTTPException(status_code=500, detail=f"Unexpected DeepSeek format: {data}")

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
        logging.exception("[CHAT ERROR] Failed during chat_with_deepseek:")
        raise HTTPException(status_code=500, detail=str(e))
