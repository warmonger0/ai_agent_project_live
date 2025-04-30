from app.plugins.plugin_loader import run_plugin
from app.db import SessionLocal
from app.models import PluginExecution
import logging

logger = logging.getLogger(__name__)

def run_plugin_job(plugin_name: str, input_text: str, source: str = "manual"):
    db = SessionLocal()
    try:
        # 🔁 Run plugin logic
        output = run_plugin(plugin_name, input_text)

        # ✅ Normalize success
        result = {"result": output} if not isinstance(output, dict) else output

        execution = PluginExecution(
            plugin_name=plugin_name,
            input_data={"input_text": input_text, "source": source},
            output_data=result,
            status="success"
        )
        db.add(execution)
        db.commit()

        logger.info(f"✅ Plugin '{plugin_name}' ran successfully [{source}]")
        return result

    except Exception as e:
        logger.exception(f"❌ Plugin '{plugin_name}' failed [{source}]")

        error = {"error": str(e)}
        execution = PluginExecution(
            plugin_name=plugin_name,
            input_data={"input_text": input_text, "source": source},
            output_data=error,
            status="error"
        )
        db.add(execution)
        db.commit()
        return error

    finally:
        db.close()
