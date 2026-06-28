import json
import logging

from google import genai

from core.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL
)

from services.llm_service import (
    ask_llm
)

logger = logging.getLogger(__name__)

client = genai.Client(
    api_key=GEMINI_API_KEY
)


###########################################################
# Parse JSON
###########################################################

def parse_json(
    text: str
):

    text = text.strip()

    if text.startswith("```"):

        text = (

            text

            .replace("```json", "")

            .replace("```", "")

            .strip()

        )

    return json.loads(text)


###########################################################
# Mock Response
###########################################################

def build_mock_response(
    metrics
):

    response = {}

    for metric in metrics:

        if metric["output_type"] == "continuous":

            score = (

                metric["min_value"]

                +

                metric["max_value"]

            ) / 2

        else:

            labels = metric["discrete_values"]

            if isinstance(labels, list) and len(labels) > 0:

                score = labels[0]

            else:

                score = "Unknown"

        response[metric["title"]] = {

            "score": score,

            "reason": "Mock response because all LLM providers failed."

        }

    return response


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

#    ###########################################################
#     # Print Prompt
#     ###########################################################

#     print("\n" + "=" * 100)
#     print("PROMPT SENT TO LLM")
#     print("=" * 100)
#     print(prompt)
#     print("=" * 100 + "\n")


    ###########################################################
    # Try Gemini
    ###########################################################

    try:

        logger.info(
            "Using Gemini"
        )

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt
        )

        print("\n" + "=" * 100)
        print("RAW GEMINI RESPONSE")
        print("=" * 100)
        print(response.text)
        print("=" * 100 + "\n")

        parsed = parse_json(
            response.text
        )

        print("\n" + "=" * 100)
        print("PARSED GEMINI JSON")
        print("=" * 100)
        print(parsed)
        print("=" * 100 + "\n")

        return parsed

    except Exception as gemini_error:

        print("\n" + "=" * 100)
        print("GEMINI ERROR")
        print("=" * 100)
        print(type(gemini_error).__name__)
        print(gemini_error)
        print("=" * 100 + "\n")

        logger.warning(
            f"Gemini failed: {gemini_error}"
        )


    ###########################################################
    # Try Ollama
    ###########################################################

    try:

        logger.info(
            "Using Ollama"
        )

        ollama_response = ask_llm(
            prompt
        )

        print("\n" + "=" * 100)
        print("RAW OLLAMA RESPONSE")
        print("=" * 100)
        print(ollama_response)
        print("=" * 100 + "\n")

        parsed = parse_json(
            ollama_response
        )

        print("\n" + "=" * 100)
        print("PARSED OLLAMA JSON")
        print("=" * 100)
        print(parsed)
        print("=" * 100 + "\n")

        return parsed

    except Exception as ollama_error:

        print("\n" + "=" * 100)
        print("OLLAMA ERROR")
        print("=" * 100)
        print(type(ollama_error).__name__)
        print(ollama_error)
        print("=" * 100 + "\n")

        logger.warning(
            f"Ollama failed: {ollama_error}"
        )


    ###########################################################
    # Mock Response
    ###########################################################

    print("\n" + "=" * 100)
    print("USING MOCK RESPONSE")
    print("=" * 100)

    mock = build_mock_response(
        metrics
    )

    print(mock)

    print("=" * 100 + "\n")

    logger.warning(
        "Returning mock response."
    )

    return mock