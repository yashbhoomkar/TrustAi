import logging

from database.postgres.connection import (
    SessionLocal
)

from database.postgres.apikey_repository import (
    create_api_key,
    get_api_keys,
    get_api_key,
    update_api_key,
    delete_api_key
)

logger = logging.getLogger(__name__)


SUPPORTED_PROVIDERS = {

    "openai",

    "gemini",

    "anthropic",

    "groq",

    "ollama",

    "openrouter"

}


###########################################################
# Mask API Key
###########################################################

def mask_api_key(
    api_key: str
):

    if len(api_key) <= 8:

        return "*" * len(api_key)

    return (
        api_key[:4]
        + "*" * (len(api_key) - 8)
        + api_key[-4:]
    )


###########################################################
# Create API Key
###########################################################

def add_api_key(

    user_id: int,

    provider: str,

    display_name: str,

    api_key: str

):

    provider = provider.lower()

    if provider not in SUPPORTED_PROVIDERS:

        return {

            "status": "error",

            "message": "Unsupported Provider"

        }

    db = SessionLocal()

    try:

        key = create_api_key(

            db,

            user_id,

            provider,

            display_name,

            api_key

        )

        return {

            "status": "success",

            "id": key.id

        }

    finally:

        db.close()


###########################################################
# List API Keys
###########################################################

def list_api_keys(

    user_id: int

):

    db = SessionLocal()

    try:

        keys = get_api_keys(

            db,

            user_id

        )

        response = []

        for key in keys:

            response.append({

                "id": key.id,

                "provider": key.provider,

                "display_name": key.display_name,

                "masked_key": mask_api_key(
                    key.api_key
                ),

                "created_at": str(
                    key.created_at
                )

            })

        return response

    finally:

        db.close()


###########################################################
# Update API Key
###########################################################

def edit_api_key(

    user_id: int,

    api_key_id: int,

    provider: str,

    display_name: str,

    api_key: str

):

    provider = provider.lower()

    if provider not in SUPPORTED_PROVIDERS:

        return {

            "status": "error",

            "message": "Unsupported Provider"

        }

    db = SessionLocal()

    try:

        key = get_api_key(

            db,

            user_id,

            api_key_id

        )

        if key is None:

            return {

                "status": "error",

                "message": "API Key Not Found"

            }

        update_api_key(

            db,

            key,

            provider,

            display_name,

            api_key

        )

        return {

            "status": "success"

        }

    finally:

        db.close()


###########################################################
# Delete API Key
###########################################################

def remove_api_key(

    user_id: int,

    api_key_id: int

):

    db = SessionLocal()

    try:

        key = get_api_key(

            db,

            user_id,

            api_key_id

        )

        if key is None:

            return {

                "status": "error",

                "message": "API Key Not Found"

            }

        delete_api_key(

            db,

            key

        )

        return {

            "status": "success"

        }

    finally:

        db.close()