"""Live end-to-end verification for the RAG chat endpoints.

Marked `live` - excluded from the default `pytest` run (see pytest.ini's
`addopts = -m "not live"`) because this hits the real database, the real
NVIDIA NIM API, and the real local reranker model (costs money for
generation/embeddings, non-deterministic answers, slow first-run model
download), unlike every other test under tests/, which mocks all of that.
Judging RAG answer quality also needs a human reading the output, not just
a boolean assert - that's what the print statements are for.

Run explicitly:
    cd backend
    source .venv/bin/activate
    pytest -m live tests/rag/test_chat_live.py -v -s
"""

import pytest
from fastapi.testclient import TestClient

from main import app

pytestmark = pytest.mark.live

TEST_USER = {
    "email": "verify-bot@example.com",
    "password": "verify-bot-password",
    "full_name": "Verify Bot",
}

QUERIES = [
    "Tell me about Shaniwar Wada.",
    "What heritage sites are in Kasba Peth?",
    "What craft heritage sites do you know about?",
    "What's the weather in Pune today?",  # out-of-scope - should decline gracefully
    "When was it built?",  # follow-up - tests multi-turn memory
]


@pytest.fixture
def live_client():
    with TestClient(app) as client:
        yield client


@pytest.fixture
def auth_headers(live_client: TestClient) -> dict:
    live_client.post("/auth/signup", json=TEST_USER)  # 409 if it already exists - fine either way
    response = live_client.post(
        "/auth/login",
        json={"email": TEST_USER["email"], "password": TEST_USER["password"]},
    )
    response.raise_for_status()
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_chat_session_answers_a_range_of_real_queries(
    live_client: TestClient, auth_headers: dict
) -> None:
    """One session, queries sent in order - later queries (the multi-turn
    follow-up) depend on earlier ones staying in the same conversation, so
    this deliberately isn't split into independent parametrized cases."""
    session_response = live_client.post("/chat/sessions", headers=auth_headers)
    session_response.raise_for_status()
    session_id = session_response.json()["id"]
    print(f"\nSession: {session_id}")

    for query in QUERIES:
        response = live_client.post(
            f"/chat/sessions/{session_id}/messages",
            json={"content": query},
            headers=auth_headers,
        )

        assert response.status_code == 200, f"{query!r} -> {response.status_code}: {response.text}"
        body = response.json()
        print(f"\nQ: {query}\nA: {body['content']}\n   referenced_site_ids: {body.get('referenced_site_ids')}")
