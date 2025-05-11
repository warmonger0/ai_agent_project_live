# GPT Agent Compliance Guide — Local AI Agent Project

This file defines the rules and expectations for any GPT-based agent (ChatGPT, Claude, DeepSeek, etc.) that interacts with this project, either through direct code contribution, planning, test generation, or QA review.

---

## 🔍 Repo Inspection Requirement

**ALL GPT agents must treat this GitHub repo as the canonical source of truth:**

**🔗 Live Repo URL:**  
[https://github.com/warmonger0/ai_agent_project_live](https://github.com/warmonger0/ai_agent_project_live)

**Before generating code, asking the user questions, or proposing changes, agents must:**

1. **Confirm if a file exists** at the expected path.
2. **Pull and inspect the file contents.**
3. **Determine whether changes are needed**, rather than proposing blindly.
4. **Explicitly state** whether a file:
   - Already exists
   - Is being newly created
   - Has been verified in the repo
   - Requires edits, and exactly where

---

## 📌 Change Rules

- **No file may be referenced** without confirming its existence first.
- If a file isn’t found at the expected path, **agents must search the repo** before prompting the user.
- **No redundant questions**: if the answer is present in the code, it must be used.
- All test files must be created **before** implementation per TDD.
- All backend code must be FastAPI-compliant (Python 3.12) and typed.
- All frontend code must follow Vite + React + TypeScript conventions.

---

## ✅ Commit Tags and Structure

Agents are encouraged to push commits with the following format:

```
GPT: <Clear summary of change>
```

Examples:
- `GPT: Add unit test for plugin_loader`
- `GPT: Fix type annotation in healing_loop.py`

---

## 📂 Folder Conventions

This repo separates test types:

- `/tests/unit/` → unit tests
- `/tests/integration/` → integration tests
- `frontend/src/__tests__/` → React + Vite frontend tests

Follow existing patterns and file naming styles for all additions.

---

## 🧠 Agent Workflow Compliance

Agents must conform to the `AutoScript Agent Framework Architecture`:
- Plan ➝ Decompose ➝ Write Tests ➝ Implement ➝ QA ➝ Merge
- Refer to `AutoScript Agent Framework Architecture v1.0.txt` in root for full hierarchy.

---

## 🧪 Testing & Validation

Before proposing a PR:
- Validate all tests pass (`pytest`, `vitest`, etc.).
- Run linters: `black`, `isort`, `ruff`, `prettier`, `eslint`.
- Never leave `any` untyped unless explicitly justified.

---

## 🔐 Secrets Policy

Agents must never read or write `.env` or hardcoded credentials.
Use mock data for testing. `.env` is excluded from Git.

---

## 🛠️ Maintainer Note

This GPT_README.md is enforced by [@spanospr](https://github.com/warmonger0) as part of a live-synced multi-agent coding project.

All GPT-based assistants are expected to adhere **strictly** to this policy for alignment, code safety, and efficiency.
