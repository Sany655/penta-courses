from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
import backend.app.models as m
import backend.app.schemas.learner as s

router = APIRouter(prefix='/learner', tags=['Learner State'])

@router.get('/profile', response_model=s.LearnerProfileOut)
def get_learner_profile(current_user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(m.LearnerProfile).filter(m.LearnerProfile.user_id == current_user.id).first()
    if not profile:
        profile = m.LearnerProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.get('/domains/{domain_id}', response_model=s.LearnerDomainStateOut)
def get_domain_state(domain_id: str, current_user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    state = db.query(m.LearnerDomainState).filter(
        m.LearnerDomainState.user_id == current_user.id,
        m.LearnerDomainState.domain_id == domain_id
    ).first()
    if not state:
        state = m.LearnerDomainState(user_id=current_user.id, domain_id=domain_id)
        db.add(state)
        db.commit()
        db.refresh(state)
    return state

@router.get('/concepts/{concept_id}', response_model=s.LearnerConceptStateOut)
def get_concept_state(concept_id: str, current_user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    state = db.query(m.LearnerConceptState).filter(
        m.LearnerConceptState.user_id == current_user.id,
        m.LearnerConceptState.concept_id == concept_id
    ).first()
    if not state:
        # Unknown state (mastery=None, low confidence)
        state = m.LearnerConceptState(user_id=current_user.id, concept_id=concept_id, mastery=None, confidence=0.0)
        db.add(state)
        db.commit()
        db.refresh(state)
    return state
