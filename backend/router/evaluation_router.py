import logging
from fastapi.responses import FileResponse
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    BackgroundTasks
)

from core.dependencies import (
    get_current_user
)

from schemas.evaluation_schema import (
    CreateEvaluationRequest
)

from services.evaluation_service import (

    create_new_evaluation,

    list_all_evaluations,

    get_evaluation_details,

    get_evaluation_results,

    download_evaluation,

    remove_evaluation,

    get_evaluation_report

)

logger = logging.getLogger(__name__)

evaluation_router = APIRouter(

    prefix="/evaluations",

    tags=["Evaluations"]

)


###########################################################
# Create Evaluation
###########################################################

@evaluation_router.post("")
async def create_evaluation_endpoint(

    request: CreateEvaluationRequest,

    background_tasks: BackgroundTasks,

    current_user = Depends(
        get_current_user
    )

):

    logger.info(

        f"User {current_user.id} started evaluation"

    )

    return create_new_evaluation(

        user_id=current_user.id,

        evaluation_name=request.evaluation_name,

        dataset_id=request.dataset_id,

        metric_ids=request.metric_ids,


    )


###########################################################
# List Evaluations
###########################################################

@evaluation_router.get("")
async def list_evaluations_endpoint(

    current_user = Depends(
        get_current_user
    )

):

    logger.info(

        f"Listing evaluations for user {current_user.id}"

    )

    return list_all_evaluations(

        current_user.id

    )


###########################################################
# Get Evaluation
###########################################################

@evaluation_router.get("/{evaluation_id}")
async def get_evaluation_endpoint(

    evaluation_id: int,

    current_user = Depends(
        get_current_user
    )

):

    logger.info(

        f"Getting evaluation {evaluation_id}"

    )

    return get_evaluation_details(

        current_user.id,

        evaluation_id

    )


###########################################################
# Delete Evaluation
###########################################################

@evaluation_router.delete("/{evaluation_id}")
async def delete_evaluation_endpoint(

    evaluation_id: int,

    current_user = Depends(
        get_current_user
    )

):

    logger.info(

        f"Deleting evaluation {evaluation_id}"

    )

    return remove_evaluation(

        current_user.id,

        evaluation_id

    )

###########################################################
# Get Evaluation Results
###########################################################

@evaluation_router.get("/{evaluation_id}/results")
async def get_evaluation_results_endpoint(

    evaluation_id: int,

    current_user = Depends(
        get_current_user
    )

):

    logger.info(

        f"Getting evaluation results {evaluation_id}"

    )

    return get_evaluation_results(

        current_user.id,

        evaluation_id

    )


###########################################################
# Download Evaluation
###########################################################

@evaluation_router.get("/{evaluation_id}/download")
async def download_evaluation_endpoint(

    evaluation_id: int,

    current_user = Depends(
        get_current_user
    )

):

    file_path = download_evaluation(

        current_user.id,

        evaluation_id

    )

    if file_path is None:

        return {

            "status": "error",

            "message": "Results file not found"

        }

    return FileResponse(

        path=file_path,

        filename=Path(file_path).name,

        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    )


###########################################################
# Get Evaluation Report
###########################################################

@evaluation_router.get("/{evaluation_id}/report")
async def get_evaluation_report_endpoint(

    evaluation_id: int,

    current_user = Depends(

        get_current_user

    )

):

    return get_evaluation_report(

        current_user.id,

        evaluation_id

    )