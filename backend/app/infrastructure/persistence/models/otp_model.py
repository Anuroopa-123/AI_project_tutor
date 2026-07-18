from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.infrastructure.persistence.database import Base


class OtpModel(Base):
    __tablename__ = "otp_verifications"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    otp_hash = Column(Text, nullable=False)

    purpose = Column(String(30), nullable=False)

    attempts = Column(Integer, default=0, nullable=False)

    max_attempts = Column(Integer, default=5, nullable=False)

    expires_at = Column(DateTime(timezone=True), nullable=False)

    consumed_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )