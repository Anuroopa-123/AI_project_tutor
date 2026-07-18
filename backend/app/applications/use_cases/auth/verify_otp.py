from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.infrastructure.persistence.models.user_model import UserModel
from app.infrastructure.persistence.models.otp_model import OtpModel
from app.infrastructure.security.password_hasher import verify_value
from app.domain.entities.otp import OtpPurpose
from app.core.exceptions import UnauthorizedError

def verify_otp(db: Session, email: str, otp: str, purpose: OtpPurpose) -> UserModel:
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise UnauthorizedError("Invalid request")

    otp_row = (
        db.query(OtpModel)
        .filter(
            OtpModel.user_id == user.id,
            OtpModel.purpose == purpose,
            OtpModel.consumed_at.is_(None),
        )
        .order_by(OtpModel.expires_at.desc())
        .first()
    )
    if not otp_row:
        raise UnauthorizedError("No active code. Request a new one.")
    if otp_row.expires_at < datetime.now(timezone.utc):
        raise UnauthorizedError("Code expired. Request a new one.")
    if otp_row.attempts >= otp_row.max_attempts:
        raise UnauthorizedError("Too many attempts. Request a new one.")

    if not verify_value(otp, otp_row.otp_hash):
        otp_row.attempts += 1
        db.commit()
        raise UnauthorizedError("Incorrect code")

    otp_row.consumed_at = datetime.now(timezone.utc)
    if purpose == OtpPurpose.REGISTER:
        user.is_verified = True
    db.commit()
    return user