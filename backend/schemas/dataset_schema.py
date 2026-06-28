from pydantic import BaseModel

from datetime import datetime


###########################################################
# Dataset Response
###########################################################

class DatasetResponse(
    BaseModel
):

    id: int

    display_name: str

    original_filename: str

    file_size: int

    rows: int | None

    columns: int | None

    status: str

    created_at: datetime

    class Config:

        from_attributes = True

from pydantic import BaseModel

###########################################################
# Update Column Mapping
###########################################################

class UpdateColumnMappingRequest(
    BaseModel
):

    mapping: dict[str, str | None]