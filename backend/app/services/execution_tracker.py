# backend/app/services/execution_tracker.py

from app.db.session import SessionLocal
from app.models import PluginExecution
import logging

logger = logging.getLogger(__name__)

def store_execution_result(plugin_name: str, input_text: str, output_data: dict, status: str, source: str):
    db = SessionLocal()
    try:
        execution = PluginExecution(
            plugin_name=plugin_name,
            input_data={"input_text": input_text, "source": source},
            output_data=output_data,
            status=status
        )
        db.add(execution)
        db.commit()
        logger.info(f"📦 Stored execution of '{plugin_name}' with status '{status}' from source '{source}'")
    except Exception:
        logger.exception(f"❌ Failed to record plugin '{plugin_name}' execution [{source}]")
    finally:
        db.close()
