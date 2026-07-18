from fastapi import HTTPException, status


class AppException(Exception):
    """
    Base exception for all application-specific exceptions.
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class BadRequestError(AppException):
    pass


class UnauthorizedError(AppException):
    pass


class ForbiddenError(AppException):
    pass


class NotFoundError(AppException):
    pass


class ConflictError(AppException):
    pass


class ValidationError(AppException):
    pass


def raise_bad_request(message: str):
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=message
    )


def raise_unauthorized(message: str = "Unauthorized"):
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=message
    )


def raise_forbidden(message: str = "Forbidden"):
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=message
    )


def raise_not_found(message: str = "Resource not found"):
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=message
    )


def raise_conflict(message: str):
    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail=message
    )


def raise_validation(message: str):
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=message
    )