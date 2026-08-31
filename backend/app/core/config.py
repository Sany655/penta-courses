import os
from typing import List, Optional

class Settings:
    # Business & Product Customization
    APP_NAME: str = os.getenv("APP_NAME", "Unified Hybrid Adaptive Learning Platform")
    BRAND_NAME: str = os.getenv("BRAND_NAME", "PentaCourse")
    BRAND_DOMAIN: str = os.getenv("BRAND_DOMAIN", "pentacourse.com")
    APP_URL: str = os.getenv("APP_URL", "https://pentacourse.com")
    SUPPORT_EMAIL: str = os.getenv("SUPPORT_EMAIL", "support@pentacourse.com")
    DEFAULT_CURRENCY: str = os.getenv("DEFAULT_CURRENCY", "USD")
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Adaptive Learning OS")
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Security & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "development-secret-key-adaptive-os-2026-super-secure")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "development-jwt-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 7)))  # 7 days

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./learning_os.db")
    DB_POOL_SIZE: int = int(os.getenv("DB_POOL_SIZE", "20"))
    DB_MAX_OVERFLOW: int = int(os.getenv("DB_MAX_OVERFLOW", "10"))
    DB_POOL_RECYCLE: int = int(os.getenv("DB_POOL_RECYCLE", "300"))

    # CORS & URLs
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    API_URL: str = os.getenv("API_URL", "http://localhost:8000")
    _cors_env: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,https://pentacourse.com")
    CORS_ORIGINS: List[str] = [x.strip() for x in _cors_env.split(",") if x.strip()]

    # AI Providers (Server-Side Only)
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)

    # Payment Gateways (Stripe & bKash)
    STRIPE_SECRET_KEY: Optional[str] = os.getenv("STRIPE_SECRET_KEY", "sk_test_mock_stripe_key_2026")
    STRIPE_WEBHOOK_SECRET: Optional[str] = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_mock_stripe_webhook_2026")
    BKASH_APP_KEY: Optional[str] = os.getenv("BKASH_APP_KEY", "bkash_sandbox_app_key")
    BKASH_APP_SECRET: Optional[str] = os.getenv("BKASH_APP_SECRET", "bkash_sandbox_app_secret")
    BKASH_USERNAME: Optional[str] = os.getenv("BKASH_USERNAME", "bkash_sandbox_user")
    BKASH_PASSWORD: Optional[str] = os.getenv("BKASH_PASSWORD", "bkash_sandbox_pass")
    BKASH_BASE_URL: str = os.getenv("BKASH_BASE_URL", "https://tokenized.sandbox.bka.sh/v1.2.0-beta")

    # Object Storage (S3 / R2)
    OBJECT_STORAGE_BUCKET: Optional[str] = os.getenv("OBJECT_STORAGE_BUCKET", None)
    OBJECT_STORAGE_ENDPOINT: Optional[str] = os.getenv("OBJECT_STORAGE_ENDPOINT", None)
    OBJECT_STORAGE_KEY: Optional[str] = os.getenv("OBJECT_STORAGE_KEY", None)
    OBJECT_STORAGE_SECRET: Optional[str] = os.getenv("OBJECT_STORAGE_SECRET", None)

    # Observability & Monitoring
    ANALYTICS_ID: Optional[str] = os.getenv("ANALYTICS_ID", None)
    SENTRY_DSN: Optional[str] = os.getenv("SENTRY_DSN", None)

    # Adaptive Algorithm Parameters
    W_GOAL: float = float(os.getenv("W_GOAL", "0.25"))
    W_WEAKNESS: float = float(os.getenv("W_WEAKNESS", "0.20"))
    W_PREREQ: float = float(os.getenv("W_PREREQ", "0.15"))
    W_RETENTION: float = float(os.getenv("W_RETENTION", "0.15"))
    W_CONTEXT: float = float(os.getenv("W_CONTEXT", "0.10"))
    W_SKILL: float = float(os.getenv("W_SKILL", "0.10"))
    W_CURIOSITY: float = float(os.getenv("W_CURIOSITY", "0.05"))
    TARGET_SUCCESS_MIN: float = float(os.getenv("TARGET_SUCCESS_MIN", "0.65"))
    TARGET_SUCCESS_MAX: float = float(os.getenv("TARGET_SUCCESS_MAX", "0.80"))

    def validate_production_secrets(self) -> None:
        """Validates that critical secrets are set when running in production mode."""
        if self.ENVIRONMENT.lower() == "production":
            required_secrets = [
                ("SECRET_KEY", self.SECRET_KEY, "development-secret-key-adaptive-os-2026-super-secure"),
                ("JWT_SECRET", self.JWT_SECRET, "development-jwt-secret-key-2026"),
                ("STRIPE_SECRET_KEY", self.STRIPE_SECRET_KEY, "sk_test_mock_stripe_key_2026"),
                ("STRIPE_WEBHOOK_SECRET", self.STRIPE_WEBHOOK_SECRET, "whsec_mock_stripe_webhook_2026"),
            ]
            missing = []
            for name, val, default_val in required_secrets:
                if not val or val == default_val:
                    missing.append(name)

            if "sqlite" in self.DATABASE_URL.lower():
                missing.append("DATABASE_URL (Production must use PostgreSQL, not SQLite)")

            if missing:
                raise ValueError(
                    f"CRITICAL PRODUCTION CONFIGURATION ERROR: The following required environment variables are missing or using insecure defaults in PRODUCTION: {', '.join(missing)}"
                )

settings = Settings()
