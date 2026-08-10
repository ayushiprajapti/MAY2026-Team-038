from unittest.mock import MagicMock

from services import auth_service


def _mock_conn(fetchone_row=None, fetchall_rows=None):
    conn = MagicMock()
    cursor = MagicMock()
    cursor.__enter__.return_value = cursor
    cursor.__exit__.return_value = False
    if fetchone_row is not None:
        cursor.fetchone.return_value = fetchone_row
    if fetchall_rows is not None:
        cursor.fetchall.return_value = fetchall_rows
    conn.cursor.return_value = cursor
    return conn, cursor


def test_get_user_by_id_is_cached():
    auth_service.get_user_by_id.cache_clear()
    conn, cursor = _mock_conn(fetchone_row={"id": "u1", "email": "a@b.com", "full_name": "A"})

    try:
        auth_service.get_user_by_id(conn, "u1")
        auth_service.get_user_by_id(conn, "u1")

        assert cursor.execute.call_count == 1
    finally:
        auth_service.get_user_by_id.cache_clear()


def test_get_user_roles_is_cached():
    auth_service.get_user_roles.cache_clear()
    conn, cursor = _mock_conn(fetchall_rows=[("system_admin",)])

    try:
        auth_service.get_user_roles(conn, "u1")
        auth_service.get_user_roles(conn, "u1")

        assert cursor.execute.call_count == 1
    finally:
        auth_service.get_user_roles.cache_clear()


