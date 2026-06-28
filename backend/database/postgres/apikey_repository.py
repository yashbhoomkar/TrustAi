import logging

from sqlalchemy.orm import Session

from database.postgres.models import ApiKey

logger = logging.getLogger(__name__)


###########################################################
# Create API Key
###########################################################

def create_api_key(
    db: Session,
    user_id: int,
    provider: str,
    display_name: str,
    api_key: str
):

    logger.info(
        f"Creating API Key for User {user_id}"
    )

    new_key = ApiKey(
        user_id=user_id,
        provider=provider,
        display_name=display_name,
        api_key=api_key
    )

    db.add(
        new_key
    )

    db.commit()

    db.refresh(
        new_key
    )

    return new_key


###########################################################
# Get API Keys
###########################################################

def get_api_keys(
    db: Session,
    user_id: int
):

    logger.info(
        f"Fetching API Keys for User {user_id}"
    )

    return (
        db.query(ApiKey)
        .filter(
            ApiKey.user_id == user_id
        )
        .all()
    )


###########################################################
# Get One API Key
###########################################################

def get_api_key(
    db: Session,
    user_id: int,
    api_key_id: int
):

    logger.info(
        f"Fetching API Key {api_key_id}"
    )

    return (
        db.query(ApiKey)
        .filter(
            ApiKey.id == api_key_id,
            ApiKey.user_id == user_id
        )
        .first()
    )


###########################################################
# Update API Key
###########################################################

def update_api_key(
    db: Session,
    api_key: ApiKey,
    provider: str,
    display_name: str,
    key: str
):

    logger.info(
        f"Updating API Key {api_key.id}"
    )

    api_key.provider = provider

    api_key.display_name = display_name

    api_key.api_key = key

    db.commit()

    db.refresh(
        api_key
    )

    return api_key


###########################################################
# Delete API Key
###########################################################

def delete_api_key(
    db: Session,
    api_key: ApiKey
):

    logger.info(
        f"Deleting API Key {api_key.id}"
    )

    db.delete(
        api_key
    )

    db.commit()