import json
import requests

OLLAMA_URL = "http://100.98.140.51:11434/api/generate"
MODEL = "llama3.2:latest"


def ask_llm(system_prompt: str, user_prompt: str) -> str:
    """
    Calls Ollama and returns the response text.
    """

    prompt = f"""
System:
{system_prompt}

User:
{user_prompt}
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
        },
        timeout=300,
    )

    response.raise_for_status()

    return response.json()["response"]