from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from main import app
from services import shop_service

client = TestClient(app)


def _mock_conn(rows):
    conn = MagicMock()
    cursor = MagicMock()
    cursor.__enter__.return_value = cursor
    cursor.__exit__.return_value = False
    cursor.fetchall.return_value = rows
    conn.cursor.return_value = cursor
    return conn, cursor


def test_list_products_is_cached():
    shop_service.list_products.cache_clear()
    conn, cursor = _mock_conn([{"id": "p1"}])

    try:
        shop_service.list_products(conn)
        shop_service.list_products(conn)

        assert cursor.execute.call_count == 1
    finally:
        # Cache key has no args besides the (excluded) connection, so a
        # mocked result here would otherwise leak into the next test that
        # calls the real endpoint.
        shop_service.list_products.cache_clear()

# A syntactically-valid UUID that (almost certainly) doesn't exist - used to
# test the "not found" path without depending on real seeded product data.
RANDOM_PRODUCT_ID = "00000000-0000-0000-0000-000000000000"


def test_list_products_is_public():
    response = client.get("/shop/products")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_search_products_is_public():
    response = client.get("/shop/products/search?q=book")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_product_returns_404_for_missing_product():
    response = client.get(f"/shop/products/{RANDOM_PRODUCT_ID}")
    assert response.status_code == 404


def test_get_product_rejects_malformed_id():
    response = client.get("/shop/products/not-a-uuid")
    assert response.status_code == 422


def test_create_order_requires_auth():
    response = client.post(
        "/shop/orders",
        json={
            "shipping_address": "Pune",
            "items": [{"product_id": RANDOM_PRODUCT_ID, "quantity": 1}],
        },
    )
    assert response.status_code == 401


def test_order_history_requires_auth():
    response = client.get("/shop/orders")
    assert response.status_code == 401


def test_create_product_requires_auth():
    response = client.post(
        "/shop/admin/products",
        json={
            "sku": "TEST-SKU",
            "name": "Test Product",
            "category": "Books",
            "price_cents": 1000,
            "stock_quantity": 5,
        },
    )
    assert response.status_code == 401


def test_update_product_requires_auth():
    response = client.patch(
        f"/shop/admin/products/{RANDOM_PRODUCT_ID}",
        json={"price_cents": 2000},
    )
    assert response.status_code == 401


def test_admin_orders_requires_auth():
    response = client.get("/shop/admin/orders")
    assert response.status_code == 401


def test_delete_product_requires_auth():
    response = client.delete(f"/shop/admin/products/{RANDOM_PRODUCT_ID}")
    assert response.status_code == 401


def test_delete_product_rejects_malformed_id_when_authorized():
    from utils.auth import get_current_user

    app.dependency_overrides[get_current_user] = lambda: {"id": RANDOM_PRODUCT_ID}
    try:
        with patch("utils.auth.get_user_roles", return_value=["shop_admin"]):
            response = client.delete("/shop/admin/products/not-a-uuid")
    finally:
        app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 422


def _admin_override():
    """Bypass auth+role check via dependency_overrides/patch (no real
    token/DB user needed) - require_roles() re-queries user_roles for the
    live user id, so get_current_user alone isn't enough."""
    from utils.auth import get_current_user

    app.dependency_overrides[get_current_user] = lambda: {"id": RANDOM_PRODUCT_ID}
    return patch("utils.auth.get_user_roles", return_value=["shop_admin"])


def test_delete_product_success_when_authorized():
    from utils.auth import get_current_user

    with _admin_override(), patch.object(shop_service, "delete_product") as mock_delete:
        try:
            response = client.delete(f"/shop/admin/products/{RANDOM_PRODUCT_ID}")
        finally:
            app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 204
    mock_delete.assert_called_once()


def test_delete_product_returns_404_for_missing_product_when_authorized():
    from fastapi import HTTPException
    from utils.auth import get_current_user

    with _admin_override(), patch.object(
        shop_service,
        "delete_product",
        side_effect=HTTPException(status_code=404, detail="Product not found"),
    ):
        try:
            response = client.delete(f"/shop/admin/products/{RANDOM_PRODUCT_ID}")
        finally:
            app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 404
