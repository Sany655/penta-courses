from datetime import datetime, timedelta, timezone
from typing import Optional, Any
import hashlib
import hmac
from jose import jwt, JWTError
from backend.app.core.config import settings

def get_password_hash(password: str) -> str:
    # Deterministic secure salted SHA256 fallback if passlib is slow/unavailable on py3.13
    salt = settings.SECRET_KEY[:16].encode('utf-8')
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000).hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    expected = get_password_hash(plain_password)
    return hmac.compare_digest(expected, hashed_password)

def create_access_token(subject: str | Any, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {'exp': expire, 'sub': str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
