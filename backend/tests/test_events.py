"""Tests for all admin event endpoints.

Endpoints covered
─────────────────
  GET    /events/admin/                      list events + dashboard stats
  POST   /events/admin/                      create event
  GET    /events/admin/{id}/registrations    attendee list
  PATCH  /events/admin/{id}                  partial update
  DELETE /events/admin/{id}                  hard delete

Design
──────
All tests run against the in-memory FakeConnection / FakeCursor defined in
conftest.py — no real Postgres is touched.  Each test function gets a fresh
client and fake_db_store fixture (function scope by default).
"""
from uuid import uuid4

from fastapi.testclient import TestClient


# ─── shared helpers ────────────────────────────────────────────────────────────


def _auth_headers(client: TestClient) -> dict[str, str]:
    """Register a coordinator and return a valid Bearer-auth header dict."""
    client.post(
        "/auth/signup",
        json={
            "email": "coordinator@example.com",
            "password": "supersecret",
            "full_name": "Event Coordinator",
        },
    )
    resp = client.post(
        "/auth/login",
        json={"email": "coordinator@example.com", "password": "supersecret"},
    )
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


def _make_event(event_id: str | None = None, **overrides: object) -> dict:
    """Return a fully-populated event dict for seeding fake_db_store['events']."""
    base: dict = {
        "id": event_id or str(uuid4()),
        "title": "Heritage Walk — Shaniwar Wada",
        "description": "A guided morning walk.",
        "event_type": "heritage_walk",
        "venue": "Shaniwar Wada, Pune",
        "event_date": "2026-12-01",   # far future → counts as upcoming
        "start_time": "07:00:00",
        "end_time": "10:00:00",
        "participant_limit": 30,
        "registration_deadline": None,
        "coordinator_id": str(uuid4()),
        "status": "published",
        "registration_count": 0,
    }
    return {**base, **overrides}


VALID_CREATE_PAYLOAD: dict = {
    "title": "Heritage Walk — Shaniwar Wada",
    "event_date": "2026-12-01",
    "start_time": "07:00:00",
    "end_time": "10:00:00",
    "venue": "Shaniwar Wada, Bajirao Road, Pune",
    "participant_limit": 30,
    "registration_deadline": None,
    "event_type": "heritage_walk",
    "description": "A guided morning walk.",
}


# ═══════════════════════════════════════════════════════════════════════════════
# GET /events/admin/  —  list events + dashboard stats
# ═══════════════════════════════════════════════════════════════════════════════


def test_list_events_requires_authentication(client: TestClient) -> None:
    response = client.get("/events/admin/")

    assert response.status_code == 401


def test_list_events_returns_stat_keys_and_event_list(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id))

    body = client.get("/events/admin/", headers=_auth_headers(client)).json()

    assert "upcoming_events" in body
    assert "total_registrations" in body
    assert "completed_events" in body
    assert "events" in body
    assert len(body["events"]) == 1
    assert body["events"][0]["id"] == event_id
    assert body["events"][0]["title"] == "Heritage Walk — Shaniwar Wada"
    assert body["events"][0]["status"] == "published"


def test_list_events_upcoming_count_is_correct(
    client: TestClient, fake_db_store: dict
) -> None:
    # published + future → upcoming
    fake_db_store["events"].append(_make_event(status="published", event_date="2026-12-01"))
    # completed → not upcoming
    fake_db_store["events"].append(_make_event(status="completed", event_date="2025-01-01"))

    body = client.get("/events/admin/", headers=_auth_headers(client)).json()

    assert body["upcoming_events"] == 1
    assert body["completed_events"] == 1


def test_list_events_counts_only_active_registrations(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id))
    # 2 confirmed + 1 cancelled → total_registrations should be 2
    for status in ("confirmed", "confirmed", "cancelled"):
        fake_db_store["event_registrations"].append(
            {"id": str(uuid4()), "event_id": event_id, "user_id": str(uuid4()), "status": status}
        )

    body = client.get("/events/admin/", headers=_auth_headers(client)).json()

    assert body["total_registrations"] == 2


def test_list_events_returns_empty_when_no_events(
    client: TestClient, fake_db_store: dict
) -> None:
    body = client.get("/events/admin/", headers=_auth_headers(client)).json()

    assert body["events"] == []
    assert body["upcoming_events"] == 0
    assert body["completed_events"] == 0
    assert body["total_registrations"] == 0


# ═══════════════════════════════════════════════════════════════════════════════
# POST /events/admin/  —  create event
# ═══════════════════════════════════════════════════════════════════════════════


def test_create_event_requires_authentication(client: TestClient) -> None:
    response = client.post("/events/admin/", json=VALID_CREATE_PAYLOAD)

    assert response.status_code == 401


def test_create_event_returns_201_with_correct_shape(client: TestClient) -> None:
    response = client.post(
        "/events/admin/", json=VALID_CREATE_PAYLOAD, headers=_auth_headers(client)
    )

    assert response.status_code == 201
    body = response.json()
    assert "id" in body
    assert body["title"] == VALID_CREATE_PAYLOAD["title"]
    assert body["event_type"] == "heritage_walk"
    assert body["status"] == "published"
    assert body["registration_count"] == 0


def test_create_event_is_persisted_in_store(
    client: TestClient, fake_db_store: dict
) -> None:
    client.post(
        "/events/admin/", json=VALID_CREATE_PAYLOAD, headers=_auth_headers(client)
    )

    assert len(fake_db_store["events"]) == 1
    assert fake_db_store["events"][0]["title"] == VALID_CREATE_PAYLOAD["title"]
    assert fake_db_store["events"][0]["status"] == "published"


def test_create_event_rejects_invalid_event_type(client: TestClient) -> None:
    response = client.post(
        "/events/admin/",
        json={**VALID_CREATE_PAYLOAD, "event_type": "rave_party"},
        headers=_auth_headers(client),
    )

    assert response.status_code == 422


def test_create_event_rejects_zero_participant_limit(client: TestClient) -> None:
    response = client.post(
        "/events/admin/",
        json={**VALID_CREATE_PAYLOAD, "participant_limit": 0},
        headers=_auth_headers(client),
    )

    assert response.status_code == 422


def test_create_event_rejects_negative_participant_limit(client: TestClient) -> None:
    response = client.post(
        "/events/admin/",
        json={**VALID_CREATE_PAYLOAD, "participant_limit": -5},
        headers=_auth_headers(client),
    )

    assert response.status_code == 422


def test_create_event_rejects_empty_title(client: TestClient) -> None:
    response = client.post(
        "/events/admin/",
        json={**VALID_CREATE_PAYLOAD, "title": ""},
        headers=_auth_headers(client),
    )

    assert response.status_code == 422


def test_create_event_rejects_missing_required_fields(client: TestClient) -> None:
    response = client.post(
        "/events/admin/",
        json={"title": "Incomplete payload"},
        headers=_auth_headers(client),
    )

    assert response.status_code == 422


# ═══════════════════════════════════════════════════════════════════════════════
# GET /events/admin/{event_id}/registrations  —  attendee list
# ═══════════════════════════════════════════════════════════════════════════════


def test_list_registrants_requires_authentication(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id))

    response = client.get(f"/events/admin/{event_id}/registrations")

    assert response.status_code == 401


def test_list_registrants_for_nonexistent_event_returns_404(
    client: TestClient,
) -> None:
    response = client.get(
        f"/events/admin/{str(uuid4())}/registrations",
        headers=_auth_headers(client),
    )

    assert response.status_code == 404


def test_list_registrants_returns_event_header_and_attendees(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id))

    user_id = str(uuid4())
    fake_db_store["users"].append(
        {
            "id": user_id,
            "email": "attendee@example.com",
            "full_name": "Aarav Kulkarni",
            "phone": "+91 98765 43210",
            "password_hash": "x",
            "is_active": True,
        }
    )
    fake_db_store["event_registrations"].append(
        {
            "id": str(uuid4()),
            "event_id": event_id,
            "user_id": user_id,
            "status": "confirmed",
            "registered_at": "2026-07-10T08:30:00+00:00",
        }
    )

    response = client.get(
        f"/events/admin/{event_id}/registrations",
        headers=_auth_headers(client),
    )

    assert response.status_code == 200
    body = response.json()
    assert body["event_id"] == event_id
    assert body["title"] == "Heritage Walk — Shaniwar Wada"
    assert body["total_registrations"] == 1
    assert len(body["registrants"]) == 1
    attendee = body["registrants"][0]
    assert attendee["full_name"] == "Aarav Kulkarni"
    assert attendee["email"] == "attendee@example.com"
    assert attendee["phone"] == "+91 98765 43210"
    assert attendee["registration_status"] == "confirmed"


def test_list_registrants_excludes_cancelled_registrations(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id))
    user_id = str(uuid4())
    fake_db_store["users"].append(
        {"id": user_id, "email": "x@example.com", "full_name": "X", "phone": None,
         "password_hash": "x", "is_active": True}
    )
    fake_db_store["event_registrations"].append(
        {"id": str(uuid4()), "event_id": event_id, "user_id": user_id,
         "status": "cancelled", "registered_at": "2026-07-10T08:30:00+00:00"}
    )

    body = client.get(
        f"/events/admin/{event_id}/registrations",
        headers=_auth_headers(client),
    ).json()

    assert body["total_registrations"] == 0
    assert body["registrants"] == []


def test_list_registrants_returns_empty_when_no_registrations(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id))

    body = client.get(
        f"/events/admin/{event_id}/registrations",
        headers=_auth_headers(client),
    ).json()

    assert body["total_registrations"] == 0
    assert body["registrants"] == []


# ═══════════════════════════════════════════════════════════════════════════════
# PATCH /events/admin/{event_id}  —  partial update
# ═══════════════════════════════════════════════════════════════════════════════


def test_update_event_requires_authentication(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id))

    response = client.patch(f"/events/admin/{event_id}", json={"title": "New"})

    assert response.status_code == 401


def test_update_event_returns_200_and_applies_changes(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id))

    response = client.patch(
        f"/events/admin/{event_id}",
        json={"title": "Updated Title", "participant_limit": 99},
        headers=_auth_headers(client),
    )

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == event_id
    assert body["title"] == "Updated Title"
    assert body["participant_limit"] == 99


def test_update_event_with_nonexistent_id_returns_404(
    client: TestClient,
) -> None:
    response = client.patch(
        f"/events/admin/{str(uuid4())}",
        json={"title": "Ghost Event"},
        headers=_auth_headers(client),
    )

    assert response.status_code == 404


def test_update_event_with_empty_body_returns_422(client: TestClient) -> None:
    response = client.patch(
        f"/events/admin/{str(uuid4())}",
        json={},
        headers=_auth_headers(client),
    )

    assert response.status_code == 422


def test_update_event_rejects_invalid_status(client: TestClient) -> None:
    response = client.patch(
        f"/events/admin/{str(uuid4())}",
        json={"status": "teleported"},
        headers=_auth_headers(client),
    )

    assert response.status_code == 422


def test_update_event_rejects_invalid_event_type(client: TestClient) -> None:
    response = client.patch(
        f"/events/admin/{str(uuid4())}",
        json={"event_type": "yoga_class"},
        headers=_auth_headers(client),
    )

    assert response.status_code == 422


def test_update_event_can_change_status_to_cancelled(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id, status="published"))

    response = client.patch(
        f"/events/admin/{event_id}",
        json={"status": "cancelled"},
        headers=_auth_headers(client),
    )

    assert response.status_code == 200
    assert response.json()["status"] == "cancelled"


# ═══════════════════════════════════════════════════════════════════════════════
# DELETE /events/admin/{event_id}  —  hard delete
# ═══════════════════════════════════════════════════════════════════════════════


def test_delete_event_requires_authentication(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id))

    response = client.delete(f"/events/admin/{event_id}")

    assert response.status_code == 401


def test_delete_event_returns_204_no_content(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id))

    response = client.delete(
        f"/events/admin/{event_id}", headers=_auth_headers(client)
    )

    assert response.status_code == 204
    assert response.content == b""


def test_delete_event_removes_event_from_store(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id))

    client.delete(f"/events/admin/{event_id}", headers=_auth_headers(client))

    assert len(fake_db_store["events"]) == 0


def test_delete_event_also_removes_its_registrations(
    client: TestClient, fake_db_store: dict
) -> None:
    event_id = str(uuid4())
    fake_db_store["events"].append(_make_event(event_id))
    fake_db_store["event_registrations"].append(
        {
            "id": str(uuid4()),
            "event_id": event_id,
            "user_id": str(uuid4()),
            "status": "confirmed",
            "registered_at": "2026-07-10T08:30:00+00:00",
        }
    )

    client.delete(f"/events/admin/{event_id}", headers=_auth_headers(client))

    assert fake_db_store["event_registrations"] == []


def test_delete_event_with_nonexistent_id_returns_404(
    client: TestClient,
) -> None:
    response = client.delete(
        f"/events/admin/{str(uuid4())}", headers=_auth_headers(client)
    )

    assert response.status_code == 404


def test_delete_event_does_not_remove_other_events(
    client: TestClient, fake_db_store: dict
) -> None:
    target_id = str(uuid4())
    other_id = str(uuid4())
    fake_db_store["events"].append(_make_event(target_id))
    fake_db_store["events"].append(_make_event(other_id))

    client.delete(f"/events/admin/{target_id}", headers=_auth_headers(client))

    remaining_ids = [e["id"] for e in fake_db_store["events"]]
    assert target_id not in remaining_ids
    assert other_id in remaining_ids
