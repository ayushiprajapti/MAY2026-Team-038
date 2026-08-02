from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

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
