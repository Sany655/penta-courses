import os
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
    if not user or not user.is_active:
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
        role=m.UserRole.USER,
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

@router.post('/forgot-password')
def forgot_password(data: s.ForgotPasswordRequest, db: Session = Depends(get_db)):
    import secrets
    import hashlib
    from datetime import datetime, timedelta, timezone
    from backend.app.core.config import settings
    from backend.app.services.email_service import EmailService

    email = data.email.strip().lower()
    user = db.query(m.User).filter(m.User.email == email).first()

    raw_token = None
    reset_url = None

    if user and user.is_active:
        # Invalidate previous unused reset tokens for this user
        db.query(m.PasswordResetToken).filter(
            m.PasswordResetToken.user_id == user.id,
            m.PasswordResetToken.used_at == None
        ).update({"used_at": datetime.now(timezone.utc)})

        # Generate fresh secure random token (32 bytes urlsafe)
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode('utf-8')).hexdigest()
        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(minutes=15)

        reset_record = m.PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires_at,
            created_at=now
        )
        db.add(reset_record)
        db.commit()

        base_url = settings.FRONTEND_URL.rstrip('/')
        reset_url = f"{base_url}/auth/reset-password?token={raw_token}"
        EmailService.send_password_reset_email(
            to_email=user.email,
            user_name=user.full_name or 'Learner',
            reset_url=reset_url
        )

    response = {
        "success": True,
        "message": "If an account matches that email address, a password reset link has been dispatched."
    }
    # Provide token link in dev/testing mode if Resend API key is not configured
    if not os.getenv("RESEND_API_KEY") and not os.getenv("SMTP_HOST") and reset_url:
        response["dev_reset_url"] = reset_url

    return response

@router.post('/verify-reset-token')
def verify_reset_token(data: s.VerifyResetTokenRequest, db: Session = Depends(get_db)):
    import hashlib
    from datetime import datetime, timezone

    token_hash = hashlib.sha256(data.token.strip().encode('utf-8')).hexdigest()
    record = db.query(m.PasswordResetToken).filter(
        m.PasswordResetToken.token_hash == token_hash,
        m.PasswordResetToken.used_at == None
    ).first()

    now = datetime.now(timezone.utc)
    if not record or (record.expires_at and record.expires_at.replace(tzinfo=timezone.utc) < now):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password reset link is invalid or has expired."
        )

    return {
        "valid": True,
        "email": record.user.email,
        "user_name": record.user.full_name or 'Learner'
    }

@router.post('/reset-password')
def reset_password(data: s.ResetPasswordRequest, db: Session = Depends(get_db)):
    import hashlib
    from datetime import datetime, timezone
    from backend.app.services.email_service import EmailService

    if len(data.new_password.strip()) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long."
        )

    token_hash = hashlib.sha256(data.token.strip().encode('utf-8')).hexdigest()
    record = db.query(m.PasswordResetToken).filter(
        m.PasswordResetToken.token_hash == token_hash,
        m.PasswordResetToken.used_at == None
    ).first()

    now = datetime.now(timezone.utc)
    if not record or (record.expires_at and record.expires_at.replace(tzinfo=timezone.utc) < now):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token."
        )

    user = record.user
    user.hashed_password = get_password_hash(data.new_password.strip())
    record.used_at = now
    db.commit()

    EmailService.send_password_changed_notification(
        to_email=user.email,
        user_name=user.full_name or 'Learner'
    )

    token = create_access_token(subject=user.id)
    return {
        "success": True,
        "message": "Password reset successfully. You can now log in with your new password.",
        "access_token": token,
        "user": user
    }

@router.post('/change-password')
def change_password(data: s.ChangePasswordRequest, current_user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    from backend.app.services.email_service import EmailService

    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password verification failed."
        )

    if len(data.new_password.strip()) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long."
        )

    current_user.hashed_password = get_password_hash(data.new_password.strip())
    db.commit()

    EmailService.send_password_changed_notification(
        to_email=current_user.email,
        user_name=current_user.full_name or 'User'
    )

    return {
        "success": True,
        "message": "Password changed successfully."
    }

