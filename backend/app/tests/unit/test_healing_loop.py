import pytest
import asyncio
from unittest.mock import patch, MagicMock, AsyncMock
from backend.app.services.healing_loop import reset_failed_tasks, healing_loop

def test_reset_failed_tasks_resets_and_commits():
    mock_task1 = MagicMock(id=1, status="failed")
    mock_task2 = MagicMock(id=2, status="failed")
    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.all.return_value = [mock_task1, mock_task2]

    with patch("app.services.healing_loop.SessionLocal", return_value=mock_db):
        reset_failed_tasks(source="test")

        assert mock_task1.status == "pending"
        assert mock_task2.status == "pending"
        mock_db.commit.assert_called_once()
        mock_db.close.assert_called_once()

@pytest.mark.asyncio
async def test_healing_loop_triggers_reset_on_failure():
    mock_logger = MagicMock()
    mock_get = AsyncMock(side_effect=Exception("simulated failure"))

    # Patch reset_failed_tasks to trigger StopAsyncIteration (exit after 1 loop)
    def fake_reset_failed_tasks(*args, **kwargs):
        raise StopAsyncIteration()

    with patch("app.services.healing_loop.httpx.AsyncClient.get", mock_get), \
         patch("app.services.healing_loop.reset_failed_tasks", side_effect=fake_reset_failed_tasks) as mock_reset, \
         patch("app.services.healing_loop.logger", mock_logger), \
         patch("app.services.healing_loop.asyncio.sleep", new_callable=AsyncMock):

        with pytest.raises(StopAsyncIteration):
            await healing_loop()

        mock_reset.assert_called_once()

@pytest.mark.asyncio
async def test_healing_loop_skips_on_success():
    mock_get = AsyncMock(return_value=MagicMock(status_code=200))

    with patch("app.services.healing_loop.httpx.AsyncClient.get", mock_get), \
         patch("app.services.healing_loop.logger") as mock_logger, \
         patch("app.services.healing_loop.asyncio.sleep", new_callable=AsyncMock) as mock_sleep:
        task = asyncio.create_task(healing_loop())
        await asyncio.sleep(0.1)
        task.cancel()
        mock_logger.info.assert_any_call("✅ Health check passed.")
