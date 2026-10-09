# Contributing Guidelines

## Branch Naming
All members must work on separate branches:
- `feature/admin-dashboard` (Sanju)
- `feature/employee-backend` (Pooja)
- `feature/llm-security-scanner` (Navya)

## Workflow
1. Commit changes to your feature branch.
2. Open a Pull Request against `main`.
3. Wait for code review (Sanju will review and merge).
4. DO NOT push directly to `main`.

## Folder Responsibilities (Backend)
- `services/`: Business logic ONLY.
- `api/routes/`: HTTP requests, validate inputs, call services, return responses.
- `repositories/`: Database queries ONLY.
- `schemas/`: Request and response validation (Pydantic).
- `models/`: Database table definitions (SQLAlchemy).
- `core/`: Configuration and shared security utilities.
- `db/`: Database connection and session management.

## Coding Rules
- Keep each feature in its own file. Avoid putting the entire application in one file.
- Use dependency injection for database sessions and services.
- Add type hints, meaningful function names, and basic error handling.
- **SECURITY**: Never hardcode API keys, passwords, or secrets. Use environment variables.
