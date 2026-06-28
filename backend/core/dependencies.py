import logging

from fastapi import (
    Depends,
    HTTPException,
    status
)

from fastapi.security import (
    OAuth2PasswordBearer
)

from sqlalchemy.orm import Session

from database.postgres.connection import (
    SessionLocal
)

from database.postgres.user_repository import (
    get_user_by_id
)

from core.auth import (
    decode_access_token
)

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


###########################################################
# Database Dependency
###########################################################

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


###########################################################
# Current User Dependency
###########################################################

def get_current_user(

    token: str = Depends(
        oauth2_scheme
    ),

    db: Session = Depends(
        get_db
    )

):

    logger.info(
        "Authenticating User"
    )

    payload = decode_access_token(
        token
    )

    if payload is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Token"
        )

    user = get_user_by_id(
        db,
        payload["user_id"]
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User Not Found"
        )

    logger.info(
        f"Authenticated User {user.email}"
    )

    return user