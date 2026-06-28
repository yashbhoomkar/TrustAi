import logging

from database.postgres.connection import (
    SessionLocal
)

from database.postgres.user_repository import (
    get_user_by_email,
    create_user
)

from core.auth import (
    hash_password,
    verify_password,
    create_access_token
)

from services.default_metric_service import (
    create_default_metrics
)

logger = logging.getLogger(__name__)


###########################################################
# Signup
###########################################################

def signup(
    email: str,
    password: str
):

    logger.info(
        f"Signup attempt: {email}"
    )

    db = SessionLocal()

    try:

        existing_user = get_user_by_email(
            db,
            email
        )

        if existing_user:

            logger.warning(
                f"User already exists: {email}"
            )

            return {
                "status": "error",
                "message": "User already exists"
            }

        hashed_password = hash_password(
            password
        )

        user = create_user(
            db,
            email,
            hashed_password
        )

        create_default_metrics(
            db=db,
            user_id=user.id
        )

        logger.info(
            f"User created successfully (ID={user.id})"
        )

        return {
            "status": "success",
            "message": "User registered successfully"
        }

    finally:

        db.close()


###########################################################
# Login
###########################################################

def login(
    email: str,
    password: str
):

    logger.info(
        f"Login attempt: {email}"
    )

    db = SessionLocal()

    try:

        user = get_user_by_email(
            db,
            email
        )

        if user is None:

            logger.warning(
                f"User not found: {email}"
            )

            return {
                "status": "error",
                "message": "Invalid credentials"
            }

        if not verify_password(
            password,
            user.hashed_password
        ):

            logger.warning(
                f"Wrong password: {email}"
            )

            return {
                "status": "error",
                "message": "Invalid credentials"
            }

        token = create_access_token(
            user.id
        )

        logger.info(
            f"Login successful (User ID={user.id})"
        )

        return {

            "status": "success",

            "access_token": token,

            "token_type": "Bearer"

        }

    finally:

        db.close()

###########################################################
# Current User
###########################################################

def get_current_user_profile(
    user
):

    logger.info(
        f"Fetching profile for User {user.id}"
    )

    return {

        "id": user.id,

        "email": user.email

    }