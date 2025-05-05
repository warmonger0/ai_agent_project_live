from fastapi.testclient import TestClient
from fastapi import FastAPI
from app.controllers.status_controller import router

app = FastAPI()
app.include_router(router)
client = TestClient(app)

def test_get_all_statuses():
    res = client.get("/api/v1/status")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
    assert "pending" in res.json()
