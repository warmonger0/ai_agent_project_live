from datetime import datetime

from app.db.session import SessionLocal
from app.models import PluginExecution


def store_plugin_execution(plugin_name: str, input_data: dict, output_data: dict, status: str) -> None:
    """
    Stores a plugin execution record in the database.

    Args:
        plugin_name (str): The name of the executed plugin.
        input_data (dict): The input payload sent to the plugin.
        output_data (dict): The result or error from plugin execution.
        status (str): One of "success" or "error".
    """
    db = SessionLocal()
    try:
        execution = PluginExecution(
            plugin_name=plugin_name,
            input_data=input_data,
            output_data=output_data,
            status=status,
            timestamp=datetime.utcnow()
        )
        db.add(execution)
        db.commit()
    finally:
        db.close()
