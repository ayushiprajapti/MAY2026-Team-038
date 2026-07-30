from __future__ import annotations

import requests

from config import settings

EMBEDDINGS_URL = "https://integrate.api.nvidia.com/v1/embeddings"
CHAT_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
RERANK_URL = "https://ai.api.nvidia.com/v1/retrieval/nvidia/nv-rerankqa-mistral-4b-v3/reranking"

EMBEDDING_MODEL = "nvidia/nv-embedqa-e5-v5"
GENERATION_MODEL = "meta/llama-3.3-70b-instruct"
RERANK_MODEL = "nvidia/nv-rerankqa-mistral-4b-v3"

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


def generate_answer(messages: list[dict[str, str]]) -> str:
    response = requests.post(
        CHAT_URL,
        headers=_headers(),
        json={
            "model": GENERATION_MODEL,
            "messages": messages,
            "temperature": 0.2,
            "max_tokens": 1024,
        },
        timeout=TIMEOUT_SECONDS,
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


def rerank(query: str, passages: list[str]) -> list[int]:
    """Returns indices into `passages`, ordered best-to-worst match for `query`."""
    response = requests.post(
        RERANK_URL,
        headers=_headers(),
        json={
            "model": RERANK_MODEL,
            "query": {"text": query},
            "passages": [{"text": passage} for passage in passages],
        },
        timeout=TIMEOUT_SECONDS,
    )
    response.raise_for_status()
    rankings = response.json()["rankings"]
    ranked = sorted(rankings, key=lambda item: item["logit"], reverse=True)
    return [item["index"] for item in ranked]
