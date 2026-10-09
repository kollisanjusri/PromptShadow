import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import OLLAMA_URL, OLLAMA_MODEL
from app.routes import scan
from app.api.routes import health, admin
from app.db.session import engine
from app.models.scan import Base

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PromptShadow API",
    description="Smart Data Leak Prevention Backend for AI Chatbots",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(scan.router)
app.include_router(health.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/health")
def health_check():
    """Check backend health and local Ollama connectivity."""
    ollama_status = "unavailable"

    try:
        url = f"{OLLAMA_URL.rstrip('/')}/api/tags"
        res = requests.get(url, timeout=2.0)

        if res.status_code == 200:
            ollama_status = "connected"
    except requests.RequestException:
        ollama_status = "unavailable"

    return {
        "status": "healthy",
        "ollama_status": ollama_status,
        "ollama_model": OLLAMA_MODEL
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
    