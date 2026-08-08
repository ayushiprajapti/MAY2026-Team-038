from unittest.mock import MagicMock

from fastapi.testclient import TestClient

from main import app
from services import dashboard_service

client = TestClient(app)


def _mock_conn(row):
    conn = MagicMock()
    cursor = MagicMock()
    cursor.__enter__.return_value = cursor
    cursor.__exit__.return_value = False
    cursor.fetchone.return_value = row
    conn.cursor.return_value = cursor
    return conn, cursor


def test_get_shop_stats_is_cached():
    dashboard_service.get_shop_stats.cache_clear()
    conn, cursor = _mock_conn({"total_orders": 1})

    try:
        dashboard_service.get_shop_stats(conn)
        dashboard_service.get_shop_stats(conn)

        assert cursor.execute.call_count == 1
    finally:
        # Cache key has no args besides the (excluded) connection, so a
        # mocked result here would otherwise leak into any later test that
        # calls the real endpoint.
        dashboard_service.get_shop_stats.cache_clear()


def test_shop_stats_requires_auth():
    response = client.get("/admin/dashboard/shop-stats")
    assert response.status_code == 401


def test_dashboard_events_requires_auth():
    response = client.get("/admin/dashboard/events")
    assert response.status_code == 401


def test_recent_volunteers_requires_auth():
    response = client.get("/admin/dashboard/recent-volunteers")
    assert response.status_code == 401
