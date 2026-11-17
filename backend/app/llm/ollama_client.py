import requests

from app.config import OLLAMA_HOST, OLLAMA_MODEL


def generate(prompt):

    if not OLLAMA_MODEL:
        raise ValueError("OLLAMA_MODEL is not configured in .env")

    response = requests.post(
        f"{OLLAMA_HOST}/api/generate",
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        },
        timeout=120
    )

    response.raise_for_status()

    data = response.json()

    return data["response"]
