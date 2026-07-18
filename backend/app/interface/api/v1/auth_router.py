from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session

from app.interface.dependencies.get_db import get_db
from app.applications.dto.auth_dto import (
    RegisterRequest, LoginRequest, VerifyOtpRequest, ResendOtpRequest,
    TokenResponse, LoginResponse,
)
from app.applications.use_cases.auth.register_user import register_user
from app.applications.use_cases.auth.login_user import login_user
from app.applications.use_cases.auth.verify_otp import verify_otp
from app.domain.entities.otp import OtpPurpose
from app.infrastructure.security.jwt_handler import create_access_token, create_refresh_token

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(
    tags=["auth"]
)

@router.post("/register")
@limiter.limit("5/minute")
def register(request: Request, payload: RegisterRequest, db: Session = Depends(get_db)):
    register_user(db, payload.name, payload.email, payload.password)
    return {"message": "OTP sent to your email"}

@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/minute")
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
    login_user(db, payload.email, payload.password)
    return LoginResponse(otp_required=True)

@router.post("/verify-otp", response_model=TokenResponse)
@limiter.limit("5/minute")
def verify_register_otp(request: Request, payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    user = verify_otp(db, payload.email, payload.otp, OtpPurpose.REGISTER)
    return TokenResponse(
        access_token=create_access_token(str(user.id), user.role),
        refresh_token=create_refresh_token(str(user.id)),
    )

@router.post("/verify-login-otp", response_model=TokenResponse)
@limiter.limit("5/minute")
def verify_login_otp(request: Request, payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    user = verify_otp(db, payload.email, payload.otp, OtpPurpose.LOGIN)
    return TokenResponse(
        access_token=create_access_token(str(user.id), user.role),
        refresh_token=create_refresh_token(str(user.id)),
    )

@router.post("/resend-otp")
@limiter.limit("1/minute")
def resend_otp(request: Request, payload: ResendOtpRequest, db: Session = Depends(get_db)):
    # Reuses register/login OTP-issuing logic based on purpose — wire to
    # the matching use case (register_user's OTP block or login_user's).
    ...