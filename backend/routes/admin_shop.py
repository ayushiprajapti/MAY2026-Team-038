from uuid import UUID

from fastapi import APIRouter, Depends, File, UploadFile
from psycopg2.extensions import connection

from database import get_db
from schemas.shop import (
    CreateProductRequest,
    ImageUploadResponse,
    ProductResponse,
    UpdateProductRequest,
)
from services import shop_service
from services.image_service import ImageFolder, upload_image
from utils.auth import require_roles

router = APIRouter(
    prefix="/shop/admin",
    tags=["admin-shop"],
)


@router.post(
    "/products/upload-image",
    response_model=ImageUploadResponse,
    status_code=201,
)
def upload_product_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_roles("shop_admin")),
):
    image_url = upload_image(file, ImageFolder.SHOP)
    return {"image_url": image_url}


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
    result = shop_service.create_product(
        conn,
        payload,
        str(current_user["id"]),
    )
    shop_service.list_products.cache_clear()
    shop_service.search_products.cache_clear()
    return result


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
    result = shop_service.update_product(
        conn,
        str(product_id),
        payload,
    )
    shop_service.list_products.cache_clear()
    shop_service.get_product.cache_clear()
    shop_service.search_products.cache_clear()
    return result


@router.delete(
    "/products/{product_id}",
    status_code=204,
)
def delete_product(
    product_id: UUID,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("shop_admin")),
):
    shop_service.delete_product(conn, str(product_id))
    shop_service.list_products.cache_clear()
    shop_service.get_product.cache_clear()
    shop_service.search_products.cache_clear()


@router.get("/orders")
def get_all_orders(
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("shop_admin")),
):
    return shop_service.get_all_orders(conn)
