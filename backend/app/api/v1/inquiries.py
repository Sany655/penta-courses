from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from backend.app.api.v1.auth import get_current_user
from backend.app.core.database import get_db
import backend.app.models as m

router = APIRouter(prefix='/inquiries', tags=['Contact Inquiries'])

class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    category: str
    message: str

@router.post('', status_code=status.HTTP_201_CREATED)
def create_inquiry(data: InquiryCreate, db: Session = Depends(get_db)):
    inquiry = m.Inquiry(
        name=data.name.strip(),
        email=str(data.email).lower(),
        company=(data.company or '').strip() or None,
        category=data.category.strip(),
        message=data.message.strip(),
    )
    if not inquiry.name or not inquiry.category or not inquiry.message:
        raise HTTPException(status_code=400, detail='Name, category, and message are required')
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry
