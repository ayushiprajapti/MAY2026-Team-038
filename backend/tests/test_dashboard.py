from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_shop_stats_requires_auth():
    response = client.get("/admin/dashboard/shop-stats")
    assert response.status_code == 401


def test_dashboard_events_requires_auth():
    response = client.get("/admin/dashboard/events")
    assert response.status_code == 401


def test_recent_volunteers_requires_auth():
    response = client.get("/admin/dashboard/recent-volunteers")
    assert response.status_code == 401
