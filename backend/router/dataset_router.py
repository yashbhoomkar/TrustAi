from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form
)

from core.dependencies import (
    get_current_user
)
from services.dataset_service import (

    upload_dataset,

    list_datasets,

    get_dataset_details,

    preview_dataset,

    remove_dataset

)

from schemas.dataset_schema import (
    UpdateColumnMappingRequest
)

from services.dataset_service import (
    update_dataset_mapping
)

dataset_router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"]
)


###########################################################
# Upload Dataset
###########################################################

from fastapi import Request

@dataset_router.post("")
async def upload_dataset_endpoint(

    display_name: str = Form(...),
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)

):

    return upload_dataset(
        user_id=current_user.id,
        display_name=display_name,
        file=file
    )


###########################################################
# List Datasets
###########################################################

@dataset_router.get("")

async def list_datasets_endpoint(

    current_user=Depends(
        get_current_user
    )

):

    return list_datasets(

        current_user.id

    )


###########################################################
# Get Dataset
###########################################################

@dataset_router.get("/{dataset_id}")

async def get_dataset_endpoint(

    dataset_id: int,

    current_user=Depends(
        get_current_user
    )

):

    return get_dataset_details(

        current_user.id,

        dataset_id

    )


###########################################################
# Preview Dataset
###########################################################

@dataset_router.get(
    "/{dataset_id}/preview"
)

async def preview_dataset_endpoint(

    dataset_id: int,

    current_user = Depends(

        get_current_user

    )

):

    return preview_dataset(

        current_user.id,

        dataset_id

    )

###########################################################
# Delete Dataset
###########################################################

@dataset_router.delete("/{dataset_id}")

async def delete_dataset_endpoint(

    dataset_id: int,

    current_user=Depends(
        get_current_user
    )

):

    return remove_dataset(

        current_user.id,

        dataset_id

    )

###########################################################
# Update Dataset Mapping
###########################################################

@dataset_router.put(
    "/{dataset_id}/mapping"
)
async def update_dataset_mapping_endpoint(

    dataset_id: int,

    request: UpdateColumnMappingRequest,

    current_user=Depends(
        get_current_user
    )

):

    return update_dataset_mapping(

        user_id=current_user.id,

        dataset_id=dataset_id,

        mapping=request.mapping

    )