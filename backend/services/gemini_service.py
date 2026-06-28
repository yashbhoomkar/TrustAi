import json
import logging

from google import genai

from core.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL
)

logger = logging.getLogger(__name__)

client = genai.Client(
    api_key=GEMINI_API_KEY
)


###########################################################
# Evaluate One Dataset Row
###########################################################

def evaluate_row(

    metrics,

    user_prompt,

    expected_response,

    llm_response

):

    metric_prompt = ""

    for index, metric in enumerate(

        metrics,

        start=1

    ):

        metric_prompt += f"""

Metric {index}

Title:
{metric["title"]}

Description:
{metric["description"]}

System Prompt:
{metric["system_prompt"]}

General Instructions:
{metric["general_instructions"]}

Output Type:
{metric["output_type"]}

"""

        if metric["output_type"] == "continuous":

            metric_prompt += f"""

Range:
{metric["min_value"]}
to
{metric["max_value"]}

"""

        else:

            metric_prompt += f"""

Allowed Labels:

{metric["discrete_values"]}

"""

    prompt = f"""
You are an expert LLM evaluator.

Evaluate the LLM response using ALL metrics.

====================

{metric_prompt}

====================

User Prompt

{user_prompt}

====================

Expected Response

{expected_response}

====================

LLM Response

{llm_response}

====================

Return ONLY valid JSON.

Example:

{{
    "Accuracy": {{

        "score": 9.2,

        "reason": "..."

    }},

    "Faithfulness": {{

        "score": 8.9,

        "reason": "..."

    }}

}}

Do not return markdown.

Do not return explanations.

Return ONLY JSON.
"""

    response = client.models.generate_content(

        model=GEMINI_MODEL,

        contents=prompt

    )

    text = response.text.strip()

    if text.startswith("```"):

        text = (

            text

            .replace("```json","")

            .replace("```","")

            .strip()

        )

    try:

        return json.loads(text)

    except Exception:

        logger.exception(

            "Gemini returned invalid JSON."

        )

        return {}