import logging

from sqlalchemy.orm import Session

from database.postgres.models import Metric

logger = logging.getLogger(__name__)


###########################################################
# Create Metric
###########################################################

def create_metric(

    db: Session,

    user_id: int,

    title: str,

    description: str,

    system_prompt: str,

    general_instructions: str,

    output_type: str,

    min_value: int | None,

    max_value: int | None,

    discrete_values: list | None,

    is_default=False

):

    logger.info(
        f"Creating Metric for User {user_id}"
    )

    metric = Metric(

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

    db.add(metric)

    db.commit()

    db.refresh(metric)

    return metric


###########################################################
# List Metrics
###########################################################

def get_metrics(

    db: Session,

    user_id: int

):

    logger.info(
        f"Fetching Metrics for User {user_id}"
    )

    return (

        db.query(Metric)

        .filter(

            Metric.user_id == user_id

        )

        .order_by(

            Metric.created_at.desc()

        )

        .all()

    )


###########################################################
# Get Metric
###########################################################

def get_metric(

    db: Session,

    user_id: int,

    metric_id: int

):

    logger.info(
        f"Fetching Metric {metric_id}"
    )

    return (

        db.query(Metric)

        .filter(

            Metric.id == metric_id,

            Metric.user_id == user_id

        )

        .first()

    )


###########################################################
# Update Metric
###########################################################

def update_metric(

    db: Session,

    metric: Metric,

    **kwargs

):

    logger.info(
        f"Updating Metric {metric.id}"
    )

    for key, value in kwargs.items():

        setattr(

            metric,

            key,

            value

        )

    db.commit()

    db.refresh(metric)

    return metric


###########################################################
# Delete Metric
###########################################################

def delete_metric(

    db: Session,

    metric: Metric

):

    logger.info(
        f"Deleting Metric {metric.id}"
    )

    db.delete(metric)

    db.commit()