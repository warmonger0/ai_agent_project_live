from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx
import logging
import asyncio

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
                            if chunk.strip():
                                yield f"data: {chunk}\n\n"
                            await asyncio.sleep(0.01)  # Yield time for frontend rendering

            return StreamingResponse(stream_gen(), media_type="text/event-stream")

        # fallback to regular (non-stream) mode
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

async def query_deepseek(messages: list[dict]) -> str:
    """
    Sends messages to DeepSeek and returns assistant's content.
    """
    import httpx
    try:
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
            response.raise_for_status()
            data = response.json()

            return data.get("message", {}).get("content", "")
    except Exception as e:
        raise RuntimeError(f"Failed to reach DeepSeek: {e}")
