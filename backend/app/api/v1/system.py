from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.core.database import get_db
from backend.app.core.config import settings
import backend.app.models as m

router = APIRouter(prefix="/system", tags=["System & Diagnostics"])

@router.get("/info")
def get_system_info(db: Session = Depends(get_db)):
    domain_count = db.query(m.Domain).count()
    concept_count = db.query(m.Concept).count()
    activity_count = db.query(m.Activity).count()
    course_count = db.query(m.Course).count()

    return {
        "platform_name": "Unified Hybrid Adaptive Learning Platform",
        "version": settings.VERSION,
        "environment": "production_ready",
        "learning_modes": ["STRUCTURED_TRACK", "SELF_DIRECTED_ADAPTIVE_MISSION"],
        "cognitive_archetypes": [
            "sequence_engine",
            "causal_graph",
            "variable_sandbox",
            "spatial_canvas",
            "comparative_matrix",
            "dialectical_builder",
            "taxonomy_sorter"
        ],
        "supported_gateways": ["STRIPE", "BKASH"],
        "database_stats": {
            "domains": domain_count,
            "concepts": concept_count,
            "activities": activity_count,
            "courses": course_count
        }
    }

@router.get("/health")
def get_system_health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "api_version": settings.VERSION
    }
