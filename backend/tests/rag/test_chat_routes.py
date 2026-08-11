from unittest.mock import patch
from uuid import uuid4

from fastapi.testclient import TestClient

SIGNUP_PAYLOAD = {
    "email": "chatuser@example.com",
    "password": "supersecret",
    "full_name": "Chat User",
}


def _auth_headers(client: TestClient) -> dict:
    client.post("/auth/signup", json=SIGNUP_PAYLOAD)
    login = client.post(
        "/auth/login",
        json={"email": SIGNUP_PAYLOAD["email"], "password": SIGNUP_PAYLOAD["password"]},
    )
    token = login.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@patch("routes.chat.chat_service.create_session")
def test_start_session_without_token_is_allowed_anonymously(mock_create_session, client: TestClient) -> None:
    # Chat is intentionally open to anonymous callers (utils.auth.get_optional_user
    # returns None instead of raising) - anon sessions are just stored with
    # user_id=None rather than being rejected outright.
    session_id = str(uuid4())
    mock_create_session.return_value = {
        "id": session_id, "user_id": None,
        "started_at": "2026-07-31T00:00:00Z", "ended_at": None,
    }

    response = client.post("/chat/sessions")

    assert response.status_code == 201
    mock_create_session.assert_called_once()
    assert mock_create_session.call_args.args[1] is None  # user_id passed as None


@patch("routes.chat.chat_service.create_session")
def test_start_session_with_token_returns_session(mock_create_session, client: TestClient) -> None:
    headers = _auth_headers(client)
    session_id = str(uuid4())
    mock_create_session.return_value = {
        "id": session_id, "user_id": str(uuid4()),
        "started_at": "2026-07-31T00:00:00Z", "ended_at": None,
    }

    response = client.post("/chat/sessions", headers=headers)

    assert response.status_code == 201
    assert response.json()["id"] == session_id


@patch("routes.chat.chat_service.send_message")
def test_send_message_returns_assistant_reply(mock_send_message, client: TestClient) -> None:
    headers = _auth_headers(client)
    session_id = str(uuid4())
    mock_send_message.return_value = {
        "id": str(uuid4()), "session_id": session_id, "role": "assistant",
        "content": "Shaniwar Wada was built in 1732.", "referenced_site_ids": [],
        "created_at": "2026-07-31T00:00:00Z",
    }

    response = client.post(
        f"/chat/sessions/{session_id}/messages",
        json={"content": "Tell me about Shaniwar Wada"},
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["content"] == "Shaniwar Wada was built in 1732."


@patch("routes.chat.chat_service.send_message")
def test_send_message_without_token_is_allowed_anonymously(mock_send_message, client: TestClient) -> None:
    session_id = str(uuid4())
    mock_send_message.return_value = {
        "id": str(uuid4()), "session_id": session_id, "role": "assistant",
        "content": "Hi there.", "referenced_site_ids": [],
        "created_at": "2026-07-31T00:00:00Z",
    }

    response = client.post(f"/chat/sessions/{session_id}/messages", json={"content": "hi"})

    assert response.status_code == 200
    mock_send_message.assert_called_once()
    assert mock_send_message.call_args.args[2] is None  # user_id passed as None


def test_send_message_with_blank_content_is_rejected(client: TestClient) -> None:
    headers = _auth_headers(client)

    response = client.post(
        f"/chat/sessions/{uuid4()}/messages", json={"content": ""}, headers=headers
    )

    assert response.status_code == 422


@patch("routes.chat.chat_service.list_messages")
@patch("routes.chat.chat_service.get_owned_session")
def test_read_messages_returns_history(mock_get_session, mock_list_messages, client: TestClient) -> None:
    headers = _auth_headers(client)
    session_id = str(uuid4())
    mock_get_session.return_value = {"id": session_id, "user_id": str(uuid4())}
    mock_list_messages.return_value = [
        {
            "id": str(uuid4()), "session_id": session_id, "role": "user", "content": "hi",
            "referenced_site_ids": None, "created_at": "2026-07-31T00:00:00Z",
        }
    ]

    response = client.get(f"/chat/sessions/{session_id}/messages", headers=headers)

    assert response.status_code == 200
    assert len(response.json()) == 1
