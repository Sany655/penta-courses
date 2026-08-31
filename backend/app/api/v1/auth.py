from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token
import backend.app.models as m
import backend.app.schemas.user as s

router = APIRouter(prefix='/auth', tags=['Authentication'])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/v1/auth/token')

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> m.User:
    payload = decode_access_token(token)
    if not payload or 'sub' not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid or expired credentials')
    user = db.query(m.User).filter(m.User.id == payload['sub']).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
    return user

@router.post('/register', response_model=s.TokenResponse)
def register(data: s.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(m.User).filter(m.User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Email is already registered')
    
    user = m.User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        full_name=data.full_name,
        role=data.role or m.UserRole.STUDENT,
        is_active=True
    )
    db.add(user)
    db.flush()

    # Default Learner Profile
    profile = m.LearnerProfile(user_id=user.id)
    db.add(profile)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id)
    return {'access_token': token, 'token_type': 'bearer', 'user': user}

@router.post('/login', response_model=s.TokenResponse)
def login(data: s.UserLogin, db: Session = Depends(get_db)):
    user = db.query(m.User).filter(m.User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid email or password')
    
    token = create_access_token(subject=user.id)
    return {'access_token': token, 'token_type': 'bearer', 'user': user}

@router.post('/token')
def login_for_swagger(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(m.User).filter(m.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid email or password')
    token = create_access_token(subject=user.id)
    return {'access_token': token, 'token_type': 'bearer'}

@router.get('/me', response_model=s.UserResponse)
def get_me(current_user: m.User = Depends(get_current_user)):
    return current_user
