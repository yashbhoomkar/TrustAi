import logging

from sqlalchemy.orm import Session

from database.postgres.models import Evaluation

logger = logging.getLogger(__name__)


###########################################################
# Create Evaluation
###########################################################

def create_evaluation(

    db: Session,

    user_id: int,

    dataset_id: int,

    evaluation_name: str,

    metrics: list,

    total_rows: int,

    results_path: str

):
    print("STEP 1 - create_new_evaluation entered")
    
    logger.info(
        f"Creating Evaluation for User {user_id}"
    )


    evaluation = Evaluation(

        user_id=user_id,

        dataset_id=dataset_id,

        evaluation_name=evaluation_name,

        metrics=metrics,

        total_rows=total_rows,

        results_path=results_path,

        status="queued",

        completed_rows=0

    )

    db.add(
        evaluation
    )

    db.commit()

    db.refresh(
        evaluation
    )

    return evaluation


###########################################################
# List Evaluations
###########################################################

def get_evaluations(

    db: Session,

    user_id: int

):

    logger.info(
        f"Fetching Evaluations for User {user_id}"
    )

    return (

        db.query(Evaluation)

        .filter(

            Evaluation.user_id == user_id

        )

        .order_by(

            Evaluation.created_at.desc()

        )

        .all()

    )


###########################################################
# Get Evaluation
###########################################################

def get_evaluation(

    db: Session,

    user_id: int,

    evaluation_id: int

):

    logger.info(
        f"Fetching Evaluation {evaluation_id}"
    )

    return (

        db.query(Evaluation)

        .filter(

            Evaluation.id == evaluation_id,

            Evaluation.user_id == user_id

        )

        .first()

    )


###########################################################
# Update Evaluation
###########################################################

def update_evaluation(

    db: Session,

    evaluation: Evaluation,

    **kwargs

):

    logger.info(
        f"Updating Evaluation {evaluation.id}"
    )

    for key, value in kwargs.items():

        setattr(

            evaluation,

            key,

            value

        )

    db.commit()

    db.refresh(
        evaluation
    )

    return evaluation


###########################################################
# Delete Evaluation
###########################################################

def delete_evaluation(

    db: Session,

    evaluation: Evaluation

):

    logger.info(
        f"Deleting Evaluation {evaluation.id}"
    )

    db.delete(
        evaluation
    )

    db.commit()

###########################################################
# Get Evaluation By ID
###########################################################

def get_evaluation_by_id(

    db: Session,

    evaluation_id: int

):

    logger.info(
        f"Fetching Evaluation {evaluation_id}"
    )

    return (

        db.query(Evaluation)

        .filter(

            Evaluation.id == evaluation_id

        )

        .first()

    )