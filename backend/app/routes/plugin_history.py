from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import traceback

from app.db.session import get_db
from app.models import PluginExecution
from app.core.api_response import success_response

router = APIRouter()

@router.get("/history")
def get_plugin_execution_history(limit: int = 10, db: Session = Depends(get_db)):
    try:
        executions = (
            db.query(PluginExecution)
            .order_by(PluginExecution.timestamp.desc())
            .limit(limit)
            .all()
        )
        return success_response([
            {
                "id": e.id,
                "plugin_name": e.plugin_name,
                "input_data": e.input_data,
                "output_data": e.output_data,
                "status": e.status,
                "timestamp": e.timestamp,
            }
            for e in executions
        ])

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"DB query failed: {str(e)}")
