from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "CloudPulse Backend"

    DATABASE_URL: str = "sqlite+aiosqlite:///./cloudpulse.db"
    REDIS_URL: str = "local"
    CELERY_BROKER_URL: str = "local"
    CELERY_RESULT_BACKEND: str = "local"

    SECRET_KEY: str = "super-secret-jwt-key"
    JWT_SECRET: str = "supersecret123"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    FRONTEND_URL: str = "http://localhost:3000"
    HEURISTIC_AI_THRESHOLD: float = 60.0

    AWS_DEFAULT_REGION: str = "us-east-1"

    ANTHROPIC_API_KEY: str = "mock_key"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
