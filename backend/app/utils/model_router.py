def route_task_to_model(description: str) -> str:
    """
    Always route to 'deepseek-coder' model for now.
    Future: add logic based on description.
    """
    return "deepseek-coder"
