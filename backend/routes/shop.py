from fastapi import APIRouter, Depends, Query
from psycopg2.extensions import connection

from database import get_db
from schemas.shop import (
    ProductResponse,
    CreateOrderRequest,
    OrderResponse,
)
from services import shop_service
from utils.auth import get_current_user

router = APIRouter(
    prefix="/shop",
    tags=["shop"],
)


@router.get(
    "/products",
    response_model=list[ProductResponse],
)
def list_products(
    conn: connection = Depends(get_db),
):
    return shop_service.list_products(conn)


@router.get(
    "/products/search",
    response_model=list[ProductResponse],
)
def search_products(
    q: str = Query(...),
    conn: connection = Depends(get_db),
):
    return shop_service.search_products(conn, q)


@router.get(
    "/products/{product_id}",
    response_model=ProductResponse,
)
def get_product(
    product_id: str,
    conn: connection = Depends(get_db),
):
    return shop_service.get_product(conn, product_id)


@router.post(
    "/orders",
    response_model=OrderResponse,
    status_code=201,
)
def create_order(
    payload: CreateOrderRequest,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return shop_service.create_order(
        conn,
        str(current_user["id"]),
        payload,
    )


@router.get(
    "/orders",
)
def get_order_history(
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return shop_service.get_order_history(
        conn,
        str(current_user["id"]),
    )