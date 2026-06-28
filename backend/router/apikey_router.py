import logging

from fastapi import (
    APIRouter,
    Path,
    Depends
)

from core.dependencies import (
    get_current_user
)

from schemas.apikey_schema import (
    CreateApiKeyRequest,
    UpdateApiKeyRequest
)

from services.apikey_service import (
    add_api_key,
    list_api_keys,
    edit_api_key,
    remove_api_key
)

logger = logging.getLogger(
    __name__
)

apikey_router = APIRouter(
    prefix="/apikey",
    tags=["API Keys"]
)


###########################################################
# Create API Key
###########################################################

@apikey_router.post("")
async def create_api_key_endpoint(

    request: CreateApiKeyRequest,

    current_user = Depends(
        get_current_user
    )

):

    logger.info(
        f"Create API Key Request from User {current_user.id}"
    )

    return add_api_key(

        user_id=current_user.id,

        provider=request.provider,

        display_name=request.display_name,

        api_key=request.api_key

    )


###########################################################
# List API Keys
###########################################################

@apikey_router.get("")
async def get_api_keys_endpoint(

    current_user = Depends(
        get_current_user
    )

):

    logger.info(
        f"List API Keys Request from User {current_user.id}"
    )

    return list_api_keys(

        current_user.id

    )


###########################################################
# Update API Key
###########################################################

@apikey_router.put("/{api_key_id}")
async def update_api_key_endpoint(

    api_key_id: int = Path(...),

    request: UpdateApiKeyRequest = ...,

    current_user = Depends(
        get_current_user
    )

):

    logger.info(
        f"Update API Key {api_key_id} by User {current_user.id}"
    )

    return edit_api_key(

        user_id=current_user.id,

        api_key_id=api_key_id,

        provider=request.provider,

        display_name=request.display_name,

        api_key=request.api_key

    )


###########################################################
# Delete API Key
###########################################################

@apikey_router.delete("/{api_key_id}")
async def delete_api_key_endpoint(

    api_key_id: int,

    current_user = Depends(
        get_current_user
    )

):

    logger.info(
        f"Delete API Key {api_key_id} by User {current_user.id}"
    )

    return remove_api_key(

        user_id=current_user.id,

        api_key_id=api_key_id

    )