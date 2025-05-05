from app.utils.model_router import route_task_to_model

def test_model_router_returns_deepseek():
    assert route_task_to_model("summarize this paragraph") == "deepseek-coder"
    assert route_task_to_model("") == "deepseek-coder"
    assert route_task_to_model("generate Python code") == "deepseek-coder"
