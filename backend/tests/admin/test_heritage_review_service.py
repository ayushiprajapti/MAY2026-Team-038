from unittest.mock import MagicMock

from services.heritage_review_service import get_pending_submissions, get_all_regions


def _mock_conn(rows):
    conn = MagicMock()
    cursor = MagicMock()
    cursor.__enter__.return_value = cursor
    cursor.__exit__.return_value = False
    cursor.fetchall.return_value = rows
    conn.cursor.return_value = cursor
    return conn, cursor


def setup_function():
    get_pending_submissions.cache_clear()
    get_all_regions.cache_clear()


def test_get_pending_submissions_applies_category_filter():
    conn, cursor = _mock_conn([])
    get_pending_submissions(conn, "pending_review", category="built", region_id=None)

    sql = cursor.execute.call_args[0][0]
    params = cursor.execute.call_args[0][1]
    assert "hs.category = %s" in sql
    assert "built" in params


def test_get_pending_submissions_applies_region_filter():
    conn, cursor = _mock_conn([])
    get_pending_submissions(conn, None, category=None, region_id="11111111-1111-1111-1111-111111111111")

    sql = cursor.execute.call_args[0][0]
    params = cursor.execute.call_args[0][1]
    assert "hs.region_id = %s" in sql
    assert "11111111-1111-1111-1111-111111111111" in params


def test_get_pending_submissions_sorts_description_first():
    conn, cursor = _mock_conn([])
    get_pending_submissions(conn, None)

    sql = cursor.execute.call_args[0][0]
    assert "ORDER BY (hs.description IS NULL OR hs.description = '') ASC, hs.created_at DESC" in sql


def test_get_pending_submissions_is_cached_per_filter_combo():
    conn, cursor = _mock_conn([{"id": 1}])
    get_pending_submissions(conn, "pending_review")
    get_pending_submissions(conn, "pending_review")
    assert cursor.execute.call_count == 1  # second call hit the cache

    get_pending_submissions(conn, "approved")
    assert cursor.execute.call_count == 2  # different status -> cache miss


def test_get_all_regions_returns_id_and_name():
    conn, cursor = _mock_conn([{"id": "r1", "name": "Pune City"}])
    result = get_all_regions(conn)
    assert result == [{"id": "r1", "name": "Pune City"}]
