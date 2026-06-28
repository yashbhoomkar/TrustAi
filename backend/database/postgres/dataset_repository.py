import logging

from sqlalchemy.orm import Session

from database.postgres.models import Dataset

logger = logging.getLogger(__name__)


###########################################################
# Create Dataset
###########################################################

def create_dataset(

    db: Session,

    user_id: int,

    display_name: str,

    original_filename: str,

    stored_filename: str,

    storage_path: str,

    file_size: int,

    rows: int,

    columns: int,

    column_names: list,

    column_mapping: dict | None = None

):

    logger.info(
        f"Creating Dataset for User {user_id}"
    )

    dataset = Dataset(

        user_id=user_id,

        display_name=display_name,

        original_filename=original_filename,

        stored_filename=stored_filename,

        storage_path=storage_path,

        file_size=file_size,

        rows=rows,

        columns=columns,

        column_names=column_names,

        column_mapping=column_mapping,

        status="uploaded"

    )

    db.add(
        dataset
    )

    db.commit()

    db.refresh(
        dataset
    )

    return dataset


###########################################################
# List Datasets
###########################################################

def get_datasets(

    db: Session,

    user_id: int

):

    logger.info(
        f"Fetching datasets for User {user_id}"
    )

    return (

        db.query(Dataset)

        .filter(
            Dataset.user_id == user_id
        )

        .order_by(
            Dataset.created_at.desc()
        )

        .all()

    )


###########################################################
# Get One Dataset
###########################################################

def get_dataset(

    db: Session,

    user_id: int,

    dataset_id: int

):

    logger.info(
        f"Fetching Dataset {dataset_id}"
    )

    return (

        db.query(Dataset)

        .filter(

            Dataset.id == dataset_id,

            Dataset.user_id == user_id

        )

        .first()

    )


###########################################################
# Update Dataset
###########################################################

def update_dataset(

    db: Session,

    dataset: Dataset,

    **kwargs

):

    logger.info(
        f"Updating Dataset {dataset.id}"
    )

    for key, value in kwargs.items():

        setattr(
            dataset,
            key,
            value
        )

    db.commit()

    db.refresh(
        dataset
    )

    return dataset


###########################################################
# Delete Dataset
###########################################################

def delete_dataset(

    db: Session,

    dataset: Dataset

):

    logger.info(
        f"Deleting Dataset {dataset.id}"
    )

    db.delete(
        dataset
    )

    db.commit()