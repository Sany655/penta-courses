from fastapi import APIRouter
from backend.app.api.v1.auth import router as auth_router
from backend.app.api.v1.domains import router as domains_router
from backend.app.api.v1.courses import router as courses_router
from backend.app.api.v1.goals import router as goals_router
from backend.app.api.v1.learner import router as learner_router
from backend.app.api.v1.adaptive import router as adaptive_router
from backend.app.api.v1.sessions import router as sessions_router
from backend.app.api.v1.curiosity import router as curiosity_router
from backend.app.api.v1.projects import router as projects_router
from backend.app.api.v1.tracks import router as tracks_router
from backend.app.api.v1.admin import router as admin_router
from backend.app.api.v1.commerce import router as commerce_router
from backend.app.api.v1.generator import router as generator_router
from backend.app.api.v1.telemetry import router as telemetry_router
from backend.app.api.v1.system import router as system_router
from backend.app.api.v1.sync import router as sync_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(domains_router)
api_router.include_router(courses_router)
api_router.include_router(goals_router)
api_router.include_router(learner_router)
api_router.include_router(adaptive_router)
api_router.include_router(sessions_router)
api_router.include_router(curiosity_router)
api_router.include_router(projects_router)
api_router.include_router(tracks_router)
api_router.include_router(admin_router)
api_router.include_router(commerce_router)
api_router.include_router(generator_router)
api_router.include_router(telemetry_router)
api_router.include_router(system_router)
api_router.include_router(sync_router)
