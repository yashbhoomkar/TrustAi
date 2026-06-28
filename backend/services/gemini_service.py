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

import json

###########################################################
# Evaluate One Dataset Row
###########################################################

def evaluate_row(

    metrics,

    user_prompt,

    expected_response,

    llm_response

):

    ###########################################################
    # Build Metric Description
    ###########################################################

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
{metric["min_value"]} to {metric["max_value"]}

"""

        else:

            metric_prompt += f"""

Allowed Labels:
{metric["discrete_values"]}

"""

    ###########################################################
    # Build Dynamic JSON Example
    ###########################################################

    example = {}

    for metric in metrics:

        example[metric["title"]] = {

            "score": 5,

            "reason": "Example reason"

        }

    example_json = json.dumps(

        example,

        indent=4

    )

    ###########################################################
    # Build Prompt
    ###########################################################

    prompt = f"""
You are an expert LLM evaluator.

Your task is to evaluate the LLM response using ONLY the metrics provided below.

======================================================
METRICS
======================================================

{metric_prompt}

======================================================
USER PROMPT
======================================================

{user_prompt}

======================================================
EXPECTED RESPONSE
======================================================

{expected_response}

======================================================
LLM RESPONSE
======================================================

{llm_response}

======================================================
IMPORTANT RULES
======================================================

1. Evaluate EVERY metric exactly once.

2. The JSON keys MUST EXACTLY match the metric titles.

3. Do NOT rename any metric.

4. Do NOT invent new metrics.

5. Do NOT use names like:
   - Accuracy
   - Faithfulness
   - Relevancy
   - Overall
   unless they are explicitly present in the metric titles.

6. Return ONLY valid JSON.

7. Do NOT wrap the JSON inside markdown.

8. Do NOT explain anything.

======================================================
EXAMPLE OUTPUT
======================================================

{example_json}

Return ONLY the JSON object.
"""

    ###########################################################
    # Expected Metric Names
    ###########################################################

    expected_metric_names = {

        metric["title"]

        for metric in metrics

    }

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

        #######################################################
        # Validate Keys
        #######################################################

        returned_metric_names = set(

            parsed.keys()

        )

        if returned_metric_names != expected_metric_names:

            raise ValueError(

                f"Metric mismatch.\n"

                f"Expected: {expected_metric_names}\n"

                f"Received: {returned_metric_names}"

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

        #######################################################
        # Validate Keys
        #######################################################

        returned_metric_names = set(

            parsed.keys()

        )

        if returned_metric_names != expected_metric_names:

            raise ValueError(

                f"Metric mismatch.\n"

                f"Expected: {expected_metric_names}\n"

                f"Received: {returned_metric_names}"

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