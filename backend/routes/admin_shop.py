from uuid import UUID

from fastapi import APIRouter, Depends
from psycopg2.extensions import connection

from database import get_db
from schemas.shop import (
    CreateProductRequest,
    ProductResponse,
    UpdateProductRequest,
)
from services import shop_service
from utils.auth import require_roles

router = APIRouter(
    prefix="/shop/admin",
    tags=["admin-shop"],
)


@router.post(
    "/products",
    response_model=ProductResponse,
    status_code=201,
)
def create_product(
    payload: CreateProductRequest,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("shop_admin")),
):
    return shop_service.create_product(
        conn,
        payload,
        str(current_user["id"]),
    )


@router.patch(
    "/products/{product_id}",
    response_model=ProductResponse,
)
def update_product(
    product_id: UUID,
    payload: UpdateProductRequest,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("shop_admin")),
):
    return shop_service.update_product(
        conn,
        str(product_id),
        payload,
    )


@router.get("/orders")
def get_all_orders(
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("shop_admin")),
):
    return shop_service.get_all_orders(conn)
