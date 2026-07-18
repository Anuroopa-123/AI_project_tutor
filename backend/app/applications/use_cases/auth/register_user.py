from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from app.core.exceptions import ConflictError
from app.infrastructure.persistence.models.user_model import UserModel
from app.infrastructure.persistence.models.otp_model import OtpModel
from app.infrastructure.security.password_hasher import hash_value
from app.infrastructure.security.otp_generator import generate_otp
from app.infrastructure.notifications.email_service import send_otp_email
from app.domain.entities.otp import OtpPurpose
from app.core.exceptions import ConflictError

def register_user(db: Session, name: str, email: str, password: str) -> str:
    existing = db.query(UserModel).filter(UserModel.email == email).first()
    if existing:
        raise ConflictError("Email already registered")

    user = UserModel(
        name=name,
        email=email,
        password_hash=hash_value(password),
        role="STUDENT",
        is_verified=False,
    )
    db.add(user)
    db.flush()  # get user.id without committing yet

    otp = generate_otp()
    otp_row = OtpModel(
        user_id=user.id,
        otp_hash=hash_value(otp),
        purpose=OtpPurpose.REGISTER,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=5),
    )
    db.add(otp_row)
    db.commit()

    send_otp_email(email, otp, "register")
    return str(user.id)