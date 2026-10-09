# PromptShadow

Smart Data Leak Prevention for AI Chatbots.

## Team
- **Sanju** (Team Lead): Frontend coordination, Admin Dashboard backend, integration, code reviews, and final merging.
- **Pooja**: Database schema, Employee backend, and scan history APIs.
- **Navya**: Local LLM integration, sensitive-data detection, risk scoring, redaction, and testing.

## Tech Stack
- Frontend: React.js + Vite
- Backend: Python + FastAPI
- Database: SQLite
- Local LLM: Ollama

## Local Setup

### Backend
1. `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate it:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run dev server: `uvicorn app.main:app --reload`
6. Check health: http://127.0.0.1:8000/api/health

### Frontend
1. `cd frontend`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`

## Git Commands for Setup
- Initialize Git: `git init`
- Add files: `git add .`
- Commit: `git commit -m "Initial commit"`
- Add remote: `git remote add origin <your-repo-url>`
- Push: `git push -u origin main`
