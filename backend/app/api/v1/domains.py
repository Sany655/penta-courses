from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
import backend.app.models as m
import backend.app.schemas.domain as s

router = APIRouter(prefix='/domains', tags=['Knowledge Domains'])

@router.get('', response_model=List[s.DomainOut])
def list_domains(db: Session = Depends(get_db)):
    return db.query(m.Domain).filter(m.Domain.is_public == True).all()

@router.get('/{domain_id}', response_model=s.DomainOut)
def get_domain(domain_id: str, db: Session = Depends(get_db)):
    domain = db.query(m.Domain).filter(m.Domain.id == domain_id).first()
    if not domain:
        raise HTTPException(status_code=404, detail='Domain not found')
    return domain

@router.get('/{domain_id}/graph', response_model=s.DomainGraphOut)
def get_domain_graph(domain_id: str, db: Session = Depends(get_db)):
    domain = db.query(m.Domain).filter(m.Domain.id == domain_id).first()
    if not domain:
        raise HTTPException(status_code=404, detail='Domain not found')
    
    concepts = db.query(m.Concept).filter(m.Concept.domain_id == domain_id).all()
    skills = db.query(m.Skill).filter(m.Skill.domain_id == domain_id).all()
    concept_ids = [c.id for c in concepts]
    relations = db.query(m.ConceptRelation).filter(m.ConceptRelation.from_concept_id.in_(concept_ids)).all() if concept_ids else []

    return {
        'domain': domain,
        'concepts': concepts,
        'skills': skills,
        'relations': relations
    }
