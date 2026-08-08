from unittest.mock import MagicMock

from services import event_service


def _mock_conn(rows, stats_row):
    conn = MagicMock()
    cursor = MagicMock()
    cursor.__enter__.return_value = cursor
    cursor.__exit__.return_value = False
    cursor.fetchall.side_effect = [rows]
    cursor.fetchone.side_effect = [stats_row]
    conn.cursor.return_value = cursor
    return conn, cursor


def test_list_all_events_is_cached():
    event_service.list_all_events.cache_clear()
    conn, cursor = _mock_conn(
        rows=[{"id": "e1"}],
        stats_row={"upcoming_events": 1, "completed_events": 0, "total_registrations": 0},
    )

    try:
        event_service.list_all_events(conn)
        event_service.list_all_events(conn)

        assert cursor.execute.call_count == 2  # 2 queries per call, only 1 call reached the DB
    finally:
        event_service.list_all_events.cache_clear()
