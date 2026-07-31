from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://user:password@host:5432/intach_pune"
    secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    environment: str = "development"
    cors_origins: str = "http://localhost:5173"
    nvidia_api_key: str = ""


settings = Settings()
