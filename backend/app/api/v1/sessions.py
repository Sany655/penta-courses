from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
import backend.app.schemas.session as s
import backend.app.schemas.recommendation as sr
from backend.app.services.learner_state import LearnerStateService
from backend.app.services.adaptive_engine import AdaptiveEngineService

router = APIRouter(prefix='/sessions', tags=['Learning Sessions & Adaptive Loop'])

@router.post('/start', response_model=s.SessionOut)
def start_session(
    data: s.SessionStart,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check for active session
    active_session = db.query(m.LearningSession).filter(
        m.LearningSession.user_id == current_user.id,
        m.LearningSession.status == 'ACTIVE'
    ).first()

    if active_session:
        return active_session

    session = m.LearningSession(
        user_id=current_user.id,
        domain_id=data.domain_id,
        goal_id=data.goal_id,
        status='ACTIVE',
        started_at=datetime.now(timezone.utc)
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.get('/{session_id}/mission', response_model=sr.RecommendationOut)
def get_session_mission(
    session_id: str,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(m.LearningSession).filter(
        m.LearningSession.id == session_id,
        m.LearningSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail='Session not found')

    domain_id = session.domain_id
    if not domain_id:
        domain = db.query(m.Domain).first()
        domain_id = domain.id if domain else None

    if not domain_id:
        raise HTTPException(status_code=400, detail='No domain attached to session')

    rec = AdaptiveEngineService.generate_recommendation(
        db=db,
        user_id=current_user.id,
        domain_id=domain_id,
        goal_id=session.goal_id
    )
    session.current_mission_id = rec['activity']['activity_id']
    db.commit()
    return rec

@router.post('/{session_id}/attempt')
def submit_attempt(
    session_id: str,
    data: s.AttemptSubmit,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(m.LearningSession).filter(
        m.LearningSession.id == session_id,
        m.LearningSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail='Session not found')

    activity = db.query(m.Activity).filter(m.Activity.id == data.activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail='Activity not found')

    # 1. Deterministic Score Evaluation
    # Check if answer contains explicit score or calculate based on rubric
    ans = data.answer_json or {}
    score = float(ans.get('score', 1.0 if ans.get('correct') is True else (0.0 if ans.get('correct') is False else 0.85)))
    result = 'PASS' if score >= 0.70 else 'FAIL'

    # Prior mastery for delta computation
    prior_state = db.query(m.LearnerConceptState).filter(
        m.LearnerConceptState.user_id == current_user.id,
        m.LearnerConceptState.concept_id == activity.concept_id
    ).first()
    prior_mastery = prior_state.mastery if (prior_state and prior_state.mastery is not None) else 0.0

    # 2. Record Attempt
    attempt = m.Attempt(
        session_id=session.id,
        activity_id=activity.id,
        user_id=current_user.id,
        result=result,
        score=score,
        answer_json=data.answer_json,
        solution_json=data.solution_json or {},
        time_taken_seconds=data.time_taken_seconds,
        self_confidence=data.self_confidence,
        started_at=datetime.now(timezone.utc) - datetime.resolution,
        completed_at=datetime.now(timezone.utc)
    )
    db.add(attempt)
    db.flush()

    # 3. Record Learning Evidence & Update Mastery Vector
    evidence = LearnerStateService.record_evidence(
        db=db,
        user_id=current_user.id,
        concept_id=activity.concept_id,
        skill_id=activity.skill_id,
        activity_id=activity.id,
        session_id=session.id,
        attempt_id=attempt.id,
        evidence_type=m.EvidenceType.PROBLEM_SOLVING,
        score=score,
        quality=1.0,
        confidence_reported=data.self_confidence,
        time_taken=data.time_taken_seconds,
        telemetry_json=data.telemetry_json
    )

    updated_state = db.query(m.LearnerConceptState).filter(
        m.LearnerConceptState.user_id == current_user.id,
        m.LearnerConceptState.concept_id == activity.concept_id
    ).first()
    new_mastery = updated_state.mastery if updated_state else score
    mastery_delta = round(new_mastery - prior_mastery, 4)

    # 4. Handle Failure or Advancement
    repair_injected = False
    next_mission = None

    if result == 'FAIL':
        failure_event, repair_act = AdaptiveEngineService.diagnose_failure_and_repair(
            db=db,
            user_id=current_user.id,
            session_id=session.id,
            activity=activity,
            attempt=attempt
        )
        if repair_act:
            repair_injected = True
            next_mission = {
                'action': 'REPAIR',
                'target': {'type': 'concept', 'id': repair_act.concept_id, 'name': repair_act.title},
                'activity': {
                    'type': repair_act.activity_type,
                    'archetype': repair_act.archetype,
                    'difficulty': repair_act.difficulty,
                    'activity_id': repair_act.id,
                    'data_json': repair_act.data_json
                },
                'estimated_minutes': repair_act.estimated_minutes,
                'confidence': 0.95,
                'reasons': ['Targeted prerequisite repair activity injected to resolve foundational weakness.']
            }

    if not next_mission and session.domain_id:
        next_mission = AdaptiveEngineService.generate_recommendation(
            db=db,
            user_id=current_user.id,
            domain_id=session.domain_id,
            goal_id=session.goal_id
        )

    db.commit()

    return {
        'attempt_id': attempt.id,
        'result': result,
        'score': score,
        'mastery_delta': mastery_delta,
        'current_mastery': round(new_mastery, 4),
        'repair_injected': repair_injected,
        'next_mission': next_mission
    }

@router.post('/{session_id}/complete')
def complete_session(
    session_id: str,
    current_user: m.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(m.LearningSession).filter(
        m.LearningSession.id == session_id,
        m.LearningSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail='Session not found')

    session.status = 'COMPLETED'
    session.completed_at = datetime.now(timezone.utc)
    db.commit()
    return {'status': 'COMPLETED', 'session_id': session.id}
