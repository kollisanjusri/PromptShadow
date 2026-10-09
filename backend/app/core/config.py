from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PromptShadow"
    DATABASE_URL: str = "sqlite:///./promptshadow.db"
    
    class Config:
        env_file = ".env"

settings = Settings()
