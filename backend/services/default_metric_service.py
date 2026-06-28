from database.postgres.metric_repository import (
    create_metric
)


###########################################################
# Default Metrics
###########################################################

DEFAULT_METRICS = [

    {

        "title": "Accuracy",

        "description": "Measures whether the response correctly answers the user's query.",

        "system_prompt": (
            "Evaluate the accuracy of the response. "
            "Score only factual correctness."
        ),

        "general_instructions": (
            "Return a score between 0 and 10."
        ),

        "output_type": "continuous",

        "min_value": 0,

        "max_value": 10,

        "discrete_values": None

    },

    {

        "title": "Faithfulness",

        "description": "Checks whether the response is supported by the provided context.",

        "system_prompt": (
            "Evaluate whether the answer is grounded in the supplied context."
        ),

        "general_instructions": (
            "Ignore grammar. Focus only on factual grounding."
        ),

        "output_type": "continuous",

        "min_value": 0,

        "max_value": 10,

        "discrete_values": None

    },

    {

        "title": "Relevancy",

        "description": "Measures how relevant the answer is to the user's prompt.",

        "system_prompt": (
            "Evaluate how relevant the answer is."
        ),

        "general_instructions": (
            "Ignore writing style."
        ),

        "output_type": "continuous",

        "min_value": 0,

        "max_value": 10,

        "discrete_values": None

    },

    {

        "title": "Hallucination",

        "description": "Detects unsupported claims.",

        "system_prompt": (
            "Determine whether the answer contains hallucinated information."
        ),

        "general_instructions": (
            "Only inspect factual grounding."
        ),

        "output_type": "discrete",

        "min_value": None,

        "max_value": None,

        "discrete_values": [

            "Grounded",

            "Partially Grounded",

            "Hallucinated"

        ]

    },

    {

        "title": "Context Precision",

        "description": "Measures whether retrieved context was useful.",

        "system_prompt": (
            "Evaluate whether retrieved context contributed to the answer."
        ),

        "general_instructions": "",

        "output_type": "continuous",

        "min_value": 0,

        "max_value": 10,

        "discrete_values": None

    },

    {

        "title": "Context Recall",

        "description": "Measures whether enough context was retrieved.",

        "system_prompt": (
            "Evaluate whether the retrieved context covers all required information."
        ),

        "general_instructions": "",

        "output_type": "continuous",

        "min_value": 0,

        "max_value": 10,

        "discrete_values": None

    }

]


###########################################################
# Create Default Metrics
###########################################################

def create_default_metrics(

    db,

    user_id: int

):

    for metric in DEFAULT_METRICS:

        create_metric(

            db=db,

            user_id=user_id,

            title=metric["title"],

            description=metric["description"],

            system_prompt=metric["system_prompt"],

            general_instructions=metric["general_instructions"],

            output_type=metric["output_type"],

            min_value=metric["min_value"],

            max_value=metric["max_value"],

            discrete_values=metric["discrete_values"],

            is_default=True

        )