from dataclasses import dataclass
from datetime import datetime
from enum import Enum

class OtpPurpose(str, Enum):
    REGISTER = "REGISTER"
    LOGIN = "LOGIN"

@dataclass
class Otp:
    id: str
    user_id: str
    otp_hash: str
    purpose: OtpPurpose
    attempts: int
    max_attempts: int
    expires_at: datetime
    consumed_at: datetime | None