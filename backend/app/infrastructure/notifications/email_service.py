from app.core.config import settings

def send_otp_email(to_email: str, otp: str, purpose: str) -> None:
    # Dev mode: print to console. Swap for SMTP/SendGrid/SES in production.
    print(f"[EMAIL] To: {to_email} | Purpose: {purpose} | OTP: {otp}")