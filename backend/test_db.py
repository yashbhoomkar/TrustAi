from sqlalchemy import create_engine

DATABASE_URL = (
    "postgresql://trustai_user:TrustAI2026@localhost:5432/trustai"
)

engine = create_engine(
    DATABASE_URL
)

with engine.connect() as conn:
    print(
        "Database Connected Successfully"
    )