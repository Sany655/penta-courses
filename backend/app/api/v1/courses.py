from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
import backend.app.models as m
import backend.app.schemas.course as s

router = APIRouter(prefix='/courses', tags=['Courses & Tracks'])

@router.get('', response_model=List[s.CourseOut])
def list_courses(db: Session = Depends(get_db)):
    return db.query(m.Course).filter(m.Course.is_published == True).all()

@router.get('/{course_id}', response_model=s.CourseOut)
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(m.Course).filter((m.Course.id == course_id) | (m.Course.slug == course_id)).first()
    if not course:
        raise HTTPException(status_code=404, detail='Course not found')
    return course
