from database.postgres.connection import SessionLocal
from database.postgres.models import User

db = SessionLocal()

user = db.query(User).filter(User.email == "test@test.com").first()

if existing_user:
    return {
        "status": "error",
        "message": "User already exists"
    }

print(user.email)
print(user.hashed_password)
print(type(user.hashed_password))