from pydantic import BaseModel

from typing import Literal


###########################################################
# Create Metric
###########################################################

class CreateMetricRequest(
    BaseModel
):

    title: str

    description: str | None = None

    system_prompt: str

    general_instructions: str | None = None

    output_type: Literal[
        "continuous",
        "discrete"
    ]

    min_value: int | None = None

    max_value: int | None = None

    discrete_values: list[str] | None = None


###########################################################
# Update Metric
###########################################################

class UpdateMetricRequest(
    BaseModel
):

    title: str

    description: str | None = None

    system_prompt: str

    general_instructions: str | None = None

    output_type: Literal[
        "continuous",
        "discrete"
    ]

    min_value: int | None = None

    max_value: int | None = None

    discrete_values: list[str] | None = None


###########################################################
# Metric Response
###########################################################

class MetricResponse(
    BaseModel
):

    id: int

    title: str

    description: str | None

    system_prompt: str

    general_instructions: str | None

    output_type: str

    min_value: int | None

    max_value: int | None

    discrete_values: list[str] | None

    created_at: str

    class Config:

        from_attributes = True