from pydantic import BaseModel

from datetime import datetime


###########################################################
# Create Evaluation
###########################################################

class CreateEvaluationRequest(
    BaseModel
):

    evaluation_name: str

    dataset_id: int

    metric_ids: list[int]


###########################################################
# Update Evaluation
###########################################################

class UpdateEvaluationRequest(
    BaseModel
):

    evaluation_name: str


###########################################################
# Evaluation Response
###########################################################

class EvaluationResponse(
    BaseModel
):

    id: int

    evaluation_name: str

    dataset_id: int

    status: str

    total_rows: int | None

    completed_rows: int

    created_at: datetime

    class Config:

        from_attributes = True