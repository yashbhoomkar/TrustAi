import logging

from fastapi import (
    APIRouter,
    Depends,
    Path
)

from core.dependencies import (
    get_current_user
)

from schemas.metric_schema import (

    CreateMetricRequest,

    UpdateMetricRequest

)

from services.metric_service import (

    add_metric,

    list_metrics,

    get_metric_details,

    edit_metric,

    remove_metric

)

logger = logging.getLogger(
    __name__
)

metric_router = APIRouter(

    prefix="/metrics",

    tags=["Metrics"]

)


###########################################################
# Create Metric
###########################################################

@metric_router.post("")
async def create_metric_endpoint(

    request: CreateMetricRequest,

    current_user=Depends(
        get_current_user
    )

):

    logger.info(
        f"Create Metric for User {current_user.id}"
    )

    return add_metric(

        user_id=current_user.id,

        title=request.title,

        description=request.description,

        system_prompt=request.system_prompt,

        general_instructions=request.general_instructions,

        output_type=request.output_type,

        min_value=request.min_value,

        max_value=request.max_value,

        discrete_values=request.discrete_values

    )


###########################################################
# List Metrics
###########################################################

@metric_router.get("")
async def list_metrics_endpoint(

    current_user=Depends(
        get_current_user
    )

):

    logger.info(
        f"List Metrics for User {current_user.id}"
    )

    return list_metrics(

        current_user.id

    )


###########################################################
# Get Metric
###########################################################

@metric_router.get("/{metric_id}")
async def get_metric_endpoint(

    metric_id: int = Path(...),

    current_user=Depends(
        get_current_user
    )

):

    logger.info(
        f"Get Metric {metric_id}"
    )

    return get_metric_details(

        current_user.id,

        metric_id

    )


###########################################################
# Update Metric
###########################################################

@metric_router.put("/{metric_id}")
async def update_metric_endpoint(

    metric_id: int = Path(...),

    request: UpdateMetricRequest = ...,

    current_user=Depends(
        get_current_user
    )

):

    logger.info(
        f"Update Metric {metric_id}"
    )

    return edit_metric(

        user_id=current_user.id,

        metric_id=metric_id,

        title=request.title,

        description=request.description,

        system_prompt=request.system_prompt,

        general_instructions=request.general_instructions,

        output_type=request.output_type,

        min_value=request.min_value,

        max_value=request.max_value,

        discrete_values=request.discrete_values

    )


###########################################################
# Delete Metric
###########################################################

@metric_router.delete("/{metric_id}")
async def delete_metric_endpoint(

    metric_id: int,

    current_user=Depends(
        get_current_user
    )

):

    logger.info(
        f"Delete Metric {metric_id}"
    )

    return remove_metric(

        current_user.id,

        metric_id

    )