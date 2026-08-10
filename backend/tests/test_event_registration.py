"""Tests for the user-facing event registration endpoint."""

from datetime import date, datetime, timedelta, timezone
from uuid import uuid4

from fastapi.testclient import TestClient


REGISTRATION_PAYLOAD = {
    "first_name": "Aarav",
    "last_name": "Patil",
    "email": "aarav@example.com",
    "phone": "9876543210",
    "attendee_count": 1,
    "note": "Please share accessibility information.",
    "receive_event_updates": True,
}


def _register(client: TestClient, event_id: str, headers: dict[str, str]):
    return client.post(
        f"/events/{event_id}/register", json=REGISTRATION_PAYLOAD, headers=headers
    )


def _auth_headers(client: TestClient, email: str = "visitor@example.com") -> dict[str, str]:
    client.post(
        "/auth/signup",
        json={"email": email, "password": "supersecret", "full_name": "Visitor"},
    )
    login = client.post(
        "/auth/login", json={"email": email, "password": "supersecret"}
    )
    return {"Authorization": f"Bearer {login.json()['access_token']}"}


def _event(event_id: str, **overrides: object) -> dict:
    return {
        "id": event_id,
        "title": "Heritage Walk",
        "description": "A guided walk.",
        "event_type": "heritage_walk",
        "site_id": None,
        "venue": "Pune",
        "event_date": date.today() + timedelta(days=7),
        "start_time": "08:00:00",
        "end_time": "10:00:00",
        "participant_limit": 2,
        "registration_deadline": None,
        "coordinator_id": str(uuid4()),
        "status": "published",
    } | overrides


def test_register_requires_authentication(client: TestClient, fake_db_store: dict) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_event(event_id))

    response = client.post(f"/events/{event_id}/register")

    assert response.status_code == 401


def test_register_requires_the_form_fields(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_event(event_id))

    response = client.post(
        f"/events/{event_id}/register", json={}, headers=_auth_headers(client)
    )

    assert response.status_code == 422


def test_register_confirms_when_space_is_available(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_event(event_id))

    response = _register(client, event_id, _auth_headers(client))

    assert response.status_code == 201
    assert response.json()["event_id"] == event_id
    assert response.json()["registration_status"] == "confirmed"
    assert response.json()["attendee_count"] == 1
    assert fake_db_store["event_registrations"][0]["first_name"] == "Aarav"
    assert len(fake_db_store["event_registrations"]) == 1


def test_register_waitlists_when_event_is_full(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_event(event_id, participant_limit=1))
    fake_db_store["event_registrations"].append(
        {"id": str(uuid4()), "event_id": event_id, "user_id": str(uuid4()), "status": "confirmed"}
    )

    response = _register(client, event_id, _auth_headers(client))

    assert response.status_code == 201
    assert response.json()["registration_status"] == "waitlisted"


def test_register_rejects_duplicate_registration(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_event(event_id))
    headers = _auth_headers(client)

    _register(client, event_id, headers)
    response = _register(client, event_id, headers)

    assert response.status_code == 409
    assert response.json()["detail"] == "You are already registered for this event."


def test_register_rejects_unavailable_event(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_event(event_id, status="cancelled"))

    response = _register(client, event_id, _auth_headers(client))

    assert response.status_code == 409


def test_register_returns_404_for_unknown_event(client: TestClient) -> None:
    response = _register(client, str(uuid4()), _auth_headers(client))

    assert response.status_code == 404


def test_revoke_requires_authentication(client: TestClient, fake_db_store: dict) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_event(event_id))

    response = client.delete(f"/events/{event_id}/register")

    assert response.status_code == 401


def test_revoke_marks_own_registration_cancelled(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_event(event_id))
    headers = _auth_headers(client)
    _register(client, event_id, headers)

    response = client.delete(f"/events/{event_id}/register", headers=headers)

    assert response.status_code == 204
    assert fake_db_store["event_registrations"][0]["status"] == "cancelled"


def test_revoke_promotes_first_waitlisted_user(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_event(event_id))
    headers = _auth_headers(client)
    _register(client, event_id, headers)
    waitlisted_id = str(uuid4())
    fake_db_store["event_registrations"].append(
        {
            "id": waitlisted_id,
            "event_id": event_id,
            "user_id": str(uuid4()),
            "status": "waitlisted",
            "registered_at": "2026-01-01T00:00:00+00:00",
        }
    )

    response = client.delete(f"/events/{event_id}/register", headers=headers)

    assert response.status_code == 204
    assert next(r for r in fake_db_store["event_registrations"] if r["id"] == waitlisted_id)["status"] == "confirmed"


def test_revoke_without_active_registration_returns_404(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_event(event_id))

    response = client.delete(f"/events/{event_id}/register", headers=_auth_headers(client))

    assert response.status_code == 404


def test_history_returns_registered_revoked_and_attended_events(
    client: TestClient, fake_db_store: dict
) -> None:
    headers = _auth_headers(client)
    registered_event_id = str(uuid4())
    revoked_event_id = str(uuid4())
    attended_event_id = str(uuid4())
    fake_db_store["events"].extend(
        [
            _event(registered_event_id),
            _event(revoked_event_id),
            _event(attended_event_id, status="completed"),
        ]
    )

    _register(client, registered_event_id, headers)
    _register(client, revoked_event_id, headers)
    client.delete(f"/events/{revoked_event_id}/register", headers=headers)

    user_id = fake_db_store["users"][0]["id"]
    fake_db_store["event_registrations"].append(
        {
            "id": str(uuid4()),
            "event_id": attended_event_id,
            "user_id": user_id,
            "status": "confirmed",
            "registered_at": datetime.now(timezone.utc),
        }
    )

    response = client.get("/events/my-history", headers=headers)

    assert response.status_code == 200
    statuses = {item["event_id"]: item["history_status"] for item in response.json()}
    assert statuses == {
        registered_event_id: "registered",
        revoked_event_id: "revoked",
        attended_event_id: "attended",
    }
