from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


# ---------- Product ----------

class ProductResponse(BaseModel):
    id: UUID
    sku: str
    name: str
    description: Optional[str] = None
    category: str
    price_cents: int
    stock_quantity: int
    image_url: Optional[str] = None
    is_active: bool


class CreateProductRequest(BaseModel):
    sku: str = Field(..., min_length=1)
    name: str = Field(..., min_length=1)
    description: Optional[str] = None
    category: str
    price_cents: int = Field(..., ge=0)
    stock_quantity: int = Field(..., ge=0)
    image_url: Optional[str] = None


class UpdateProductRequest(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price_cents: Optional[int] = Field(default=None, ge=0)
    stock_quantity: Optional[int] = Field(default=None, ge=0)
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


# ---------- Orders ----------

class OrderItemRequest(BaseModel):
    product_id: UUID
    quantity: int = Field(..., gt=0)


class CreateOrderRequest(BaseModel):
    shipping_address: str
    items: list[OrderItemRequest]


class OrderResponse(BaseModel):
    id: UUID
    customer_id: UUID
    status: str
    total_cents: int
    shipping_address: str


# ---------- Payment ----------

class PaymentResponse(BaseModel):
    id: UUID
    status: str
    amount_cents: int
    currency: str