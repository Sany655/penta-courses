import uuid
import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.app.core.config import settings
from backend.app.core.database import SessionLocal
from backend.app.api.v1.router import api_router
from sqlalchemy import text

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("penta.server")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup validation
    logger.info(f"Starting {settings.APP_NAME} in [{settings.ENVIRONMENT}] mode...")
    settings.validate_production_secrets()
    logger.info("Configuration validated successfully.")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security & Correlation ID Middleware
@app.middleware("http")
async def security_and_tracing_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    start_time = time.time()

    response: Response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000, 2)

    # Attach tracing and security headers
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Response-Time-Ms"] = str(duration_ms)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if settings.ENVIRONMENT == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

    return response

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    request_id = request.headers.get("X-Request-ID") or "unknown"
    logger.error(f"Unhandled Exception [req: {request_id}] on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please contact support if the issue persists.",
            "request_id": request_id
        }
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health Check"])
def health_check():
    db_ok = False
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_ok = True
    except Exception as e:
        logger.error(f"Health check DB ping failed: {str(e)}")

    return {
        "status": "healthy" if db_ok else "degraded",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": "connected" if db_ok else "disconnected",
        "app_name": settings.APP_NAME
    }
