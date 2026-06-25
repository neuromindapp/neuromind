from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    domain: str = "neuro-mind.app"
    api_origins: str = "http://localhost:5173"
    database_url: str = "postgresql+asyncpg://neuromind:neuromind@localhost:5432/neuromind"
    redis_url: str = "redis://localhost:6379/0"
    privy_app_id: str = ""
    privy_app_secret: str = ""
    helius_rpc_url: str = ""
    helius_webhook_secret: str = ""
    neuromind_token_mint: str = ""
    treasury_wallet: str = ""
    ai_provider: str = "gemini"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.1-pro-preview"
    ai_system_instruction: str = "you're the smartest model"
    anthropic_api_key: str = ""
    anthropic_prefilter_model: str = "claude-3-5-haiku-latest"
    anthropic_deepdive_model: str = "claude-sonnet-4-5"
    polymarket_gamma_url: str = "https://gamma-api.polymarket.com"

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.api_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
