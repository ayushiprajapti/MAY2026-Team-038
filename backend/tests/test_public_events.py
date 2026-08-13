from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_list_upcoming_events_is_public():
    response = client.get("/events/")

    assert response.status_code == 200
    body = response.json()
    assert "events" in body
    assert isinstance(body["events"], list)
    for event in body["events"]:
        assert set(event.keys()) >= {
            "id",
            "title",
            "event_type",
            "event_date",
            "seats_left",
            "status",
        }
        assert event["status"] == "published"


def test_list_upcoming_events_filters_by_type():
    response = client.get("/events/", params={"type": "heritage_walk"})

    assert response.status_code == 200
    body = response.json()
    for event in body["events"]:
        assert event["event_type"] == "heritage_walk"


def test_list_upcoming_events_rejects_invalid_type():
    response = client.get("/events/", params={"type": "not-a-real-type"})

    assert response.status_code == 422
