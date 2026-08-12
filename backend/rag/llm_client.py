from __future__ import annotations

import requests

from config import settings

EMBEDDINGS_URL = "https://integrate.api.nvidia.com/v1/embeddings"
CHAT_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

EMBEDDING_MODEL = "nvidia/nv-embedqa-e5-v5"
GENERATION_MODEL = "meta/llama-3.1-70b-instruct"

TIMEOUT_SECONDS = 30


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {settings.nvidia_api_key}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


def embed_texts(texts: list[str], input_type: str) -> list[list[float]]:
    """input_type must be 'query' (embedding a user question) or 'passage'
    (embedding a site chunk during indexing) - nv-embedqa-e5-v5 is an
    asymmetric retrieval model and gives poor results if these are swapped."""
    response = requests.post(
        EMBEDDINGS_URL,
        headers=_headers(),
        json={"input": texts, "model": EMBEDDING_MODEL, "input_type": input_type},
        timeout=TIMEOUT_SECONDS,
    )
    response.raise_for_status()
    data = response.json()["data"]
    ordered = sorted(data, key=lambda item: item["index"])
    return [item["embedding"] for item in ordered]


def generate_answer(messages: list[dict[str, str]], max_tokens: int = 1024) -> str:
    response = requests.post(
        CHAT_URL,
        headers=_headers(),
        json={
            "model": GENERATION_MODEL,
            "messages": messages,
            "temperature": 0.2,
            "max_tokens": max_tokens,
        },
        timeout=TIMEOUT_SECONDS,
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]
