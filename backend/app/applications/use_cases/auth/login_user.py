from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from app.infrastructure.persistence.models.user_model import UserModel
from app.infrastructure.security.password_hasher import verify_value
from app.core.exceptions import UnauthorizedError

MAX_ATTEMPTS = 5
LOCK_MINUTES = 15

def login_user(db: Session, email: str, password: str) -> UserModel:
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise UnauthorizedError("Invalid credentials")

    now = datetime.now(timezone.utc)
    if user.locked_until and user.locked_until > now:
        raise UnauthorizedError("Account locked. Try again later.")

    if not verify_value(password, user.password_hash):
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= MAX_ATTEMPTS:
            user.locked_until = now + timedelta(minutes=LOCK_MINUTES)
        db.commit()
        raise UnauthorizedError("Invalid credentials")

    if not user.is_verified:
        raise UnauthorizedError("Please verify your email first")

    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
    return user