from fastapi import FastAPI
from app.api.routes import health

app = FastAPI(
    title="PromptShadow API",
    description="Smart Data Leak Prevention for AI Chatbots",
    version="1.0.0"
)

app.include_router(health.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to PromptShadow API"}
