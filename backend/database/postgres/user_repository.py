import logging

from sqlalchemy.orm import Session

from database.postgres.models import User

logger = logging.getLogger(__name__)


def get_user_by_email(
    db: Session,
    email: str
):

    logger.info(
        f"Searching user: {email}"
    )

    return (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )


def get_user_by_id(
    db: Session,
    user_id: int
):

    logger.info(
        f"Searching user id: {user_id}"
    )

    return (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )


def create_user(
    db: Session,
    email: str,
    hashed_password: str
):

    logger.info(
        f"Creating user: {email}"
    )

    user = User(
        email=email,
        hashed_password=hashed_password
    )

    db.add(
        user
    )

    db.commit()

    db.refresh(
        user
    )

    return user