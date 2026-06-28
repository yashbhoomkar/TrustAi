import requests

OLLAMA_URL = "http://100.98.140.51:11434/api/generate"
MODEL = "llama3.2:latest"


###########################################################
# Ask Ollama
###########################################################

def ask_llm(
    prompt: str
) -> str:

    response = requests.post(

        OLLAMA_URL,

        json={

            "model": MODEL,

            "prompt": prompt,

            "stream": False

        },

        timeout=300

    )

    response.raise_for_status()

    return response.json()["response"].strip()