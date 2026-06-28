from pydantic import BaseModel


###########################################################
# Create API Key
###########################################################

class CreateApiKeyRequest(
    BaseModel
):

    provider: str

    display_name: str

    api_key: str


###########################################################
# Update API Key
###########################################################

class UpdateApiKeyRequest(
    BaseModel
):

    provider: str

    display_name: str

    api_key: str


###########################################################
# API Key Response
###########################################################

class ApiKeyResponse(
    BaseModel
):

    id: int

    provider: str

    display_name: str

    created_at: str

    class Config:

        from_attributes = True