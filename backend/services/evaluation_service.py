import json
import logging

from pathlib import Path

from openpyxl import load_workbook

from database.postgres.connection import (
    SessionLocal
)

from database.postgres.dataset_repository import (
    get_dataset
)

from database.postgres.metric_repository import (
    get_metric
)

from database.postgres.evaluation_repository import (

    create_evaluation,

    get_evaluations,

    get_evaluation,

    update_evaluation,

    delete_evaluation

)

from services.gemini_service import (
    evaluate_row
)

logger = logging.getLogger(__name__)


###########################################################
# Storage
###########################################################

EVALUATION_STORAGE = Path(
    "storage/evaluations"
)

EVALUATION_STORAGE.mkdir(
    parents=True,
    exist_ok=True
)


###########################################################
# Create Evaluation
###########################################################

def create_new_evaluation(

    user_id: int,

    evaluation_name: str,

    dataset_id: int,

    metric_ids: list[int]

):

    db = SessionLocal()

    try:

        ###################################################
        # Dataset
        ###################################################

        dataset = get_dataset(

            db,

            user_id,

            dataset_id

        )

        print("=" * 60)
        print(dataset.id)
        print(dataset.column_mapping)
        print("=" * 60)

        if dataset is None:

            return {

                "status": "error",

                "message": "Dataset not found"

            }

        ###################################################
        # Validate Column Mapping
        ###################################################

        if dataset.column_mapping is None:

            return {

                "status": "error",

                "message": "Dataset column mapping is not configured."

            }

        print(dataset.column_mapping.keys())

        required = [

            "User Prompt",

            "Expected Response",

            "LLM Response"

        ]

        for field in required:

            if (

                field not in dataset.column_mapping

                or

                dataset.column_mapping[field] is None

            ):

                return {

                    "status": "error",

                    "message": f"{field} mapping is missing."

                }

        ###################################################
        # Read Excel
        ###################################################

        workbook = load_workbook(

            dataset.storage_path,

            data_only=True

        )

        worksheet = workbook.active

        total_rows = max(

            worksheet.max_row - 1,

            0

        )

        workbook.close()

        ###################################################
        # Load Metrics
        ###################################################

        metric_snapshots = []

        for metric_id in metric_ids:

            metric = get_metric(

                db,

                user_id,

                metric_id

            )

            if metric is None:

                return {

                    "status": "error",

                    "message": f"Metric {metric_id} not found"

                }

            metric_snapshots.append({

                "id": metric.id,

                "title": metric.title,

                "description": metric.description,

                "system_prompt": metric.system_prompt,

                "general_instructions":
                    metric.general_instructions,

                "output_type":
                    metric.output_type,

                "min_value":
                    metric.min_value,

                "max_value":
                    metric.max_value,

                "discrete_values":
                    metric.discrete_values,

                "is_default":
                    metric.is_default

            })

        ###################################################
        # Create Evaluation
        ###################################################

        evaluation = create_evaluation(

            db=db,

            user_id=user_id,

            dataset_id=dataset_id,

            evaluation_name=evaluation_name,

            metrics=metric_snapshots,

            total_rows=total_rows,

            results_path=""

        )

        ###################################################
        # Create Result File
        ###################################################

        results_path = (

            EVALUATION_STORAGE /

            f"evaluation_{evaluation.id}.json"

        )

        with open(

            results_path,

            "w"

        ) as file:

            json.dump(

                [],

                file,

                indent=4

            )

        ###################################################
        # Update Evaluation
        ###################################################

        update_evaluation(

            db,

            evaluation,

            results_path=str(results_path)

        )

        ###################################################
        # Run Evaluation
        ###################################################

        run_evaluation(

            db,

            evaluation,

            dataset

        )

        return {

            "status": "success",

            "evaluation_id": evaluation.id

        }

    finally:

        db.close()


###########################################################
# Run Evaluation
###########################################################

###########################################################
# Run Evaluation
###########################################################

def run_evaluation(

    db,

    evaluation,

    dataset

):

    logger.info(

        f"Running Evaluation {evaluation.id}"

    )

    update_evaluation(

        db,

        evaluation,

        status="running"

    )

    ###################################################
    # Read Excel
    ###################################################

    workbook = load_workbook(

        dataset.storage_path,

        data_only=True

    )

    worksheet = workbook.active

    rows = list(

        worksheet.iter_rows(
            values_only=True
        )

    )

    headers = [

        str(value)

        if value is not None

        else ""

        for value in rows[0]

    ]

    mapping = dataset.column_mapping

    results = []

    ###################################################
    # Evaluate Every Row
    ###################################################

    for row_number, row in enumerate(

        rows[1:],

        start=1

    ):

        row_dict = dict(

            zip(

                headers,

                row

            )

        )

        user_prompt = str(

            row_dict.get(

                mapping["User Prompt"],

                ""

            )

        )

        expected_response = str(

            row_dict.get(

                mapping["Expected Response"],

                ""

            )

        )

        llm_response = str(

            row_dict.get(

                mapping["LLM Response"],

                ""

            )

        )

        row_result = {

            "row": row_number,

            "user_prompt": user_prompt,

            "expected_response": expected_response,

            "llm_response": llm_response,

            "metrics": {}

        }

        ###################################################
        # Evaluate Every Metric
        ###################################################

        row_result["metrics"] = evaluate_row(

            evaluation.metrics,

            user_prompt,

            expected_response,

            llm_response

        )

        results.append(

            row_result

        )

        ###################################################
        # Progress Update
        ###################################################

        update_evaluation(

            db,

            evaluation,

            completed_rows=row_number

        )

    workbook.close()

    ###################################################
    # Save Results
    ###################################################

    with open(

        evaluation.results_path,

        "w"

    ) as file:

        json.dump(

            results,

            file,

            indent=4

        )

    ###################################################
    # Finish Evaluation
    ###################################################

    update_evaluation(

        db,

        evaluation,

        status="completed",

        completed_rows=evaluation.total_rows

    )

    logger.info(

        f"Evaluation {evaluation.id} Completed"

    )

    ###########################################################
# List Evaluations
###########################################################

def list_all_evaluations(

    user_id: int

):

    db = SessionLocal()

    try:

        evaluations = get_evaluations(

            db,

            user_id

        )

        response = []

        for evaluation in evaluations:

            response.append({

                "id": evaluation.id,

                "evaluation_name":
                    evaluation.evaluation_name,

                "status":
                    evaluation.status,

                "total_rows":
                    evaluation.total_rows,

                "completed_rows":
                    evaluation.completed_rows,

                "created_at":
                    str(evaluation.created_at)

            })

        return response

    finally:

        db.close()

    ###########################################################
# Get Evaluation
###########################################################

def get_evaluation_details(

    user_id: int,

    evaluation_id: int

):

    db = SessionLocal()

    try:

        evaluation = get_evaluation(

            db,

            user_id,

            evaluation_id

        )

        if evaluation is None:

            return {

                "status":"error",

                "message":"Evaluation not found"

            }

        results = []

        if Path(

            evaluation.results_path

        ).exists():

            with open(

                evaluation.results_path,

                "r"

            ) as file:

                results = json.load(

                    file

                )

        return {

            "id":
                evaluation.id,

            "evaluation_name":
                evaluation.evaluation_name,

            "status":
                evaluation.status,

            "total_rows":
                evaluation.total_rows,

            "completed_rows":
                evaluation.completed_rows,

            "metrics":
                evaluation.metrics,

            "results":
                results,

            "created_at":
                str(evaluation.created_at)

        }

    finally:

        db.close()

    
    ###########################################################
# Delete Evaluation
###########################################################

def remove_evaluation(

    user_id: int,

    evaluation_id: int

):

    db = SessionLocal()

    try:

        evaluation = get_evaluation(

            db,

            user_id,

            evaluation_id

        )

        if evaluation is None:

            return {

                "status":"error",

                "message":"Evaluation not found"

            }

        if (

            evaluation.results_path

            and

            Path(

                evaluation.results_path

            ).exists()

        ):

            Path(

                evaluation.results_path

            ).unlink()

        delete_evaluation(

            db,

            evaluation

        )

        return {

            "status":"success",

            "message":"Evaluation deleted"

        }

    finally:

        db.close()