import logging

from datetime import (
    datetime,
    timedelta
)

from jose import (
    jwt,
    JWTError
)

from passlib.context import CryptContext

from core.config import (
    JWT_SECRET_KEY
)

logger = logging.getLogger(
    __name__
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


###########################################################
# Password Hashing
###########################################################

def hash_password(
    password: str
):

    logger.info(
        "Hashing Password"
    )

    return pwd_context.hash(
        password
    )


###########################################################
# Verify Password
###########################################################

def verify_password(
    plain_password: str,
    hashed_password: str
):

    logger.info(
        "Verifying Password"
    )

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


###########################################################
# Create JWT Token
###########################################################

def create_access_token(
    user_id: int
):

    logger.info(
        f"Creating JWT for User {user_id}"
    )

    payload = {

        "user_id": user_id,

        "exp":
        datetime.utcnow()
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=ALGORITHM
    )


###########################################################
# Decode JWT Token
###########################################################

def decode_access_token(
    token: str
):

    logger.info(
        "Decoding JWT"
    )

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[
                ALGORITHM
            ]
        )

        return payload

    except JWTError:

        logger.exception(
            "Invalid JWT"
        )

        return None