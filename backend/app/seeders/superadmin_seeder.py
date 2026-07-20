from sqlalchemy.orm import Session

from app.infrastructure.persistence.database import SessionLocal
from app.infrastructure.persistence.models.user_model import UserModel
from app.infrastructure.security.password_hasher import hash_value
from app.domain.entities.user import UserRole


SUPERADMIN_EMAIL = "superadmin@edusense.com"
SUPERADMIN_PASSWORD = "Admin@123"
SUPERADMIN_NAME = "Super Admin"


def seed_superadmin():
    db: Session = SessionLocal()

    try:
        existing = (
            db.query(UserModel)
            .filter(UserModel.email == SUPERADMIN_EMAIL)
            .first()
        )

        if existing:
            print("✅ Super Admin already exists.")
            return

        superadmin = UserModel(
            name=SUPERADMIN_NAME,
            email=SUPERADMIN_EMAIL,
            password_hash=hash_value(SUPERADMIN_PASSWORD),
            role=UserRole.SUPER_ADMIN,
            is_verified=True,
            failed_login_attempts=0,
            locked_until=None,
        )

        db.add(superadmin)
        db.commit()

        print("✅ Super Admin created successfully.")
        print(f"Email    : {SUPERADMIN_EMAIL}")
        print(f"Password : {SUPERADMIN_PASSWORD}")

    except Exception as e:
        db.rollback()
        print("❌ Seeder Failed")
        print(e)

    finally:
        db.close()


if __name__ == "__main__":
    seed_superadmin()