# Changelog

## [v0.3.0] — 2025-04-29

### 🚀 Major Features (Chat 10: Database + Memory Management)

- **SQLite Database Integration**

  - Integrated lightweight SQLite backend for local persistence.
  - Configured SQLAlchemy ORM models for `Task`, `PluginExecution`, and `MemoryLedger`.

- **Database Models**

  - Created database models with fields:
    - `tasks`: plugin name, input/output data, status, error messages, timestamps.
    - `plugin_executions`: record plugin runs, outputs, and results.
    - `memory_ledger`: future expansion for agent memory.

- **CRUD Operations**

  - Implemented `create`, `read`, `update` operations for Tasks and PluginExecutions.
  - Added helper functions inside `services/task_db.py`.

- **FastAPI API Endpoints**

  - `/tasks` (POST, GET, PATCH, GET by ID)
  - `/plugin-results` (GET)
  - `/retry/{task_id}` to reset errored tasks.

- **Full Unit Testing**

  - Unit tests for model creation (`test_models.py`).
  - Unit tests for database CRUD functions (`test_task_db.py`).

- **Full Integration Testing**

  - New integration tests for task management endpoints (`test_task_routes.py`).
  - Used a real temporary SQLite file `test_database.db` for isolated, persistent testing.
  - Added automatic cleanup for test database after test session.

- **Project Structural Updates**
  - Ensured `Base.metadata.create_all(bind=engine)` is called during app startup.
  - Registered all routes cleanly inside `main.py`.

### 🛠️ Internal Improvements

- Added `pytest.ini` config for consistent testing.
- Streamlined CORS setup and project imports.

---

# ✅ Project Status After v0.3.0

- All unit and integration tests passing ✅
- Clean database layer implemented ✅
- Modularized services and controllers ✅
- Git repository fully tagged and synchronized ✅

---
