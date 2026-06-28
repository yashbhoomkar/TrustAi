import logging

from database.postgres.connection import (
    SessionLocal
)

from database.postgres.metric_repository import (

    create_metric,

    get_metrics,

    get_metric,

    update_metric,

    delete_metric

)

logger = logging.getLogger(__name__)


SUPPORTED_OUTPUT_TYPES = {

    "continuous",

    "discrete"

}


###########################################################
# Create Metric
###########################################################

def add_metric(

    user_id: int,

    title: str,

    description: str | None,

    system_prompt: str,

    general_instructions: str | None,

    output_type: str,

    min_value: int | None,

    max_value: int | None,

    discrete_values: list[str] | None,

    is_default: bool = False

):

    logger.info(
        f"Creating Metric for User {user_id}"
    )

    if output_type not in SUPPORTED_OUTPUT_TYPES:

        return {

            "status": "error",

            "message": "Invalid output type"

        }

    db = SessionLocal()

    try:

        metric = create_metric(

            db=db,

            user_id=user_id,

            title=title,

            description=description,

            system_prompt=system_prompt,

            general_instructions=general_instructions,

            output_type=output_type,

            min_value=min_value,

            max_value=max_value,

            discrete_values=discrete_values,

            is_default=is_default

        )

        return {

            "status": "success",

            "metric_id": metric.id,

            "message": "Metric created successfully."

        }

    finally:

        db.close()


###########################################################
# List Metrics
###########################################################

def list_metrics(

    user_id: int

):

    db = SessionLocal()

    try:

        metrics = get_metrics(

            db,

            user_id

        )

        response = []

        for metric in metrics:

            response.append({

                "id": metric.id,

                "title": metric.title,

                "description": metric.description,

                "system_prompt": metric.system_prompt,

                "general_instructions": metric.general_instructions,

                "output_type": metric.output_type,

                "min_value": metric.min_value,

                "max_value": metric.max_value,

                "discrete_values": metric.discrete_values,

                "is_default": metric.is_default,

                "created_at": str(

                    metric.created_at

                )

            })

        return response

    finally:

        db.close()


###########################################################
# Get Metric
###########################################################

def get_metric_details(

    user_id: int,

    metric_id: int

):

    db = SessionLocal()

    try:

        metric = get_metric(

            db,

            user_id,

            metric_id

        )

        if metric is None:

            return {

                "status": "error",

                "message": "Metric not found"

            }

        return {

            "id": metric.id,

            "title": metric.title,

            "description": metric.description,

            "system_prompt": metric.system_prompt,

            "general_instructions": metric.general_instructions,

            "output_type": metric.output_type,

            "min_value": metric.min_value,

            "max_value": metric.max_value,

            "discrete_values": metric.discrete_values,

            "is_default": metric.is_default,

            "created_at": str(

                metric.created_at

            )

        }

    finally:

        db.close()


###########################################################
# Update Metric
###########################################################

def edit_metric(

    user_id: int,

    metric_id: int,

    title: str,

    description: str | None,

    system_prompt: str,

    general_instructions: str | None,

    output_type: str,

    min_value: int | None,

    max_value: int | None,

    discrete_values: list[str] | None

):

    db = SessionLocal()

    try:

        metric = get_metric(

            db,

            user_id,

            metric_id

        )

        if metric is None:

            return {

                "status": "error",

                "message": "Metric not found"

            }

        update_metric(

            db,

            metric,

            title=title,

            description=description,

            system_prompt=system_prompt,

            general_instructions=general_instructions,

            output_type=output_type,

            min_value=min_value,

            max_value=max_value,

            discrete_values=discrete_values

        )

        return {

            "status": "success",

            "message": "Metric updated successfully"

        }

    finally:

        db.close()


###########################################################
# Delete Metric
###########################################################

def remove_metric(

    user_id: int,

    metric_id: int

):

    db = SessionLocal()

    try:

        metric = get_metric(

            db,

            user_id,

            metric_id

        )

        if metric is None:

            return {

                "status": "error",

                "message": "Metric not found"

            }

        delete_metric(

            db,

            metric

        )

        return {

            "status": "success",

            "message": "Metric deleted successfully"

        }

    finally:

        db.close()