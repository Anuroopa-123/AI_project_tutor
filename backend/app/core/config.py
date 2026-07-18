from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    LLM_PROVIDER: str = "ollama"       # "openai" or "ollama"
    OPENAI_API_KEY: str = ""
    OLLAMA_HOST: str = "http://localhost:11434"

    class Config:
        env_file = ".env"

settings = Settings()