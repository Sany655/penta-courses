import logging
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Request, HTTPException, status
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session
from backend.app.models.user import AuthAttempt

logger = logging.getLogger("penta.rate_limiter")

MAX_LOGIN_ATTEMPTS = 5
LOGIN_LOCKOUT_MINUTES = 15

MAX_RESET_ATTEMPTS = 2
RESET_LOCKOUT_MINUTES = 5

class RateLimiterService:
    @staticmethod
    def get_client_ip(request: Request) -> str:
        """
        Safely extract client IP taking into account reverse proxies, Cloudflare, and Vercel.
        """
        # 1. Cloudflare header
        cf_ip = request.headers.get("cf-connecting-ip")
        if cf_ip:
            return cf_ip.strip()

        # 2. X-Forwarded-For header (first address is client)
        xff = request.headers.get("x-forwarded-for")
        if xff:
            client_ip = xff.split(",")[0].strip()
            if client_ip:
                return client_ip

        # 3. X-Real-IP header
        x_real = request.headers.get("x-real-ip")
        if x_real:
            return x_real.strip()

        # 4. Fallback to direct client host
        if request.client and request.client.host:
            return request.client.host

        return "127.0.0.1"

    @classmethod
    def check_login_rate_limit(cls, db: Session, ip_address: str, email: Optional[str] = None) -> None:
        """
        Verifies if an IP or specific email has exceeded the failed login threshold.
        Raises HTTP 429 Too Many Requests with Retry-After header if locked out.
        """
        now = datetime.now(timezone.utc)
        window_start = now - timedelta(minutes=LOGIN_LOCKOUT_MINUTES)
        norm_email = email.strip().lower() if email else None

        filters = [AuthAttempt.ip_address == ip_address]
        if norm_email:
            filters.append(AuthAttempt.identifier == norm_email)

        failed_attempts = db.query(AuthAttempt).filter(
            or_(*filters),
            AuthAttempt.action == 'login',
            AuthAttempt.is_successful == False,
            AuthAttempt.created_at >= window_start
        ).order_by(AuthAttempt.created_at.desc()).all()

        if len(failed_attempts) >= MAX_LOGIN_ATTEMPTS:
            # Calculate remaining seconds based on the oldest attempt that triggered the lockout
            oldest_relevant = failed_attempts[MAX_LOGIN_ATTEMPTS - 1].created_at
            if oldest_relevant.tzinfo is None:
                oldest_relevant = oldest_relevant.replace(tzinfo=timezone.utc)

            remaining_delta = (oldest_relevant + timedelta(minutes=LOGIN_LOCKOUT_MINUTES)) - now
            retry_after = max(1, int(remaining_delta.total_seconds()))
            minutes = max(1, (retry_after + 59) // 60)

            logger.warning(
                f"[RateLimiter] Login lockout triggered for IP: {ip_address}, identifier: {norm_email}. "
                f"Failed attempts: {len(failed_attempts)}, retry_after: {retry_after}s"
            )

            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Access temporarily restricted due to repeated failed login attempts. Please try again in {minutes} minute{'s' if minutes > 1 else ''}.",
                headers={"Retry-After": str(retry_after)}
            )

    @classmethod
    def record_login_attempt(cls, db: Session, ip_address: str, email: Optional[str], is_successful: bool) -> None:
        """
        Records login attempt outcome. On success, resets previous failed attempts for that user/IP.
        """
        norm_email = email.strip().lower() if email else None
        now = datetime.now(timezone.utc)

        if is_successful:
            try:
                # Clear past failed attempts upon valid login
                filters = [AuthAttempt.ip_address == ip_address]
                if norm_email:
                    filters.append(AuthAttempt.identifier == norm_email)
                db.query(AuthAttempt).filter(
                    or_(*filters),
                    AuthAttempt.action == 'login',
                    AuthAttempt.is_successful == False
                ).delete(synchronize_session=False)
                db.commit()
            except Exception as e:
                db.rollback()
                logger.error(f"[RateLimiter] Error resetting failed attempts: {e}")
        else:
            try:
                attempt = AuthAttempt(
                    ip_address=ip_address,
                    identifier=norm_email,
                    action='login',
                    is_successful=False,
                    created_at=now
                )
                db.add(attempt)
                db.commit()
            except Exception as e:
                db.rollback()
                logger.error(f"[RateLimiter] Error recording failed login attempt: {e}")

    @classmethod
    def check_forgot_password_rate_limit(cls, db: Session, ip_address: str, email: Optional[str] = None) -> None:
        """
        Throttles password reset requests to protect Gmail SMTP sending quotas.
        Allows up to MAX_RESET_ATTEMPTS in RESET_LOCKOUT_MINUTES.
        """
        now = datetime.now(timezone.utc)
        window_start = now - timedelta(minutes=RESET_LOCKOUT_MINUTES)
        norm_email = email.strip().lower() if email else None

        filters = [AuthAttempt.ip_address == ip_address]
        if norm_email:
            filters.append(AuthAttempt.identifier == norm_email)

        recent_requests = db.query(AuthAttempt).filter(
            or_(*filters),
            AuthAttempt.action == 'forgot-password',
            AuthAttempt.created_at >= window_start
        ).order_by(AuthAttempt.created_at.desc()).all()

        if len(recent_requests) >= MAX_RESET_ATTEMPTS:
            oldest_relevant = recent_requests[MAX_RESET_ATTEMPTS - 1].created_at
            if oldest_relevant.tzinfo is None:
                oldest_relevant = oldest_relevant.replace(tzinfo=timezone.utc)

            remaining_delta = (oldest_relevant + timedelta(minutes=RESET_LOCKOUT_MINUTES)) - now
            retry_after = max(1, int(remaining_delta.total_seconds()))
            minutes = max(1, (retry_after + 59) // 60)

            logger.warning(
                f"[RateLimiter] Forgot-password throttle triggered for IP: {ip_address}, identifier: {norm_email}. "
                f"Retry after {retry_after}s"
            )

            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many password reset requests. To protect your email delivery quota, please wait {minutes} minute{'s' if minutes > 1 else ''} before requesting another link.",
                headers={"Retry-After": str(retry_after)}
            )

    @classmethod
    def record_forgot_password_attempt(cls, db: Session, ip_address: str, email: Optional[str]) -> None:
        norm_email = email.strip().lower() if email else None
        now = datetime.now(timezone.utc)
        try:
            attempt = AuthAttempt(
                ip_address=ip_address,
                identifier=norm_email,
                action='forgot-password',
                is_successful=True,
                created_at=now
            )
            db.add(attempt)
            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"[RateLimiter] Error recording forgot-password attempt: {e}")
