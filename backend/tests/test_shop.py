from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_list_products():
    response = client.get("/shop/products")
    assert response.status_code in [200]


def test_search_products():
    response = client.get("/shop/products/search?q=book")
    assert response.status_code in [200]


def test_get_product():
    response = client.get(
        "/shop/products/00000000-0000-0000-0000-000000000000"
    )
    assert response.status_code in [200, 404]


def test_create_product():
    response = client.post(
        "/shop/admin/products",
        json={
            "sku": "BOOK001",
            "name": "Guide",
            "description": "Guide",
            "category": "Books",
            "price_cents": 1000,
            "stock_quantity": 5,
            "image_url": "https://example.com/book.jpg",
        },
    )

    assert response.status_code in [201, 401, 403]


def test_update_product():
    response = client.patch(
        "/shop/admin/products/00000000-0000-0000-0000-000000000000",
        json={
            "price_cents": 2000
        },
    )

    assert response.status_code in [200, 401, 403, 404]


def test_create_order():
    response = client.post(
        "/shop/orders",
        json={
            "shipping_address": "Pune",
            "items": [
                {
                    "product_id": "00000000-0000-0000-0000-000000000000",
                    "quantity": 1,
                }
            ],
        },
    )

    assert response.status_code in [201, 401, 403, 404]


def test_order_history():
    response = client.get("/shop/orders")
    assert response.status_code in [200, 401, 403]


def test_admin_orders():
    response = client.get("/shop/admin/orders")
    assert response.status_code in [200, 401, 403]