from uuid import uuid4

import psycopg2.errors
from fastapi import HTTPException, status
from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor

from schemas.shop import (
    CreateOrderRequest,
    CreateProductRequest,
    UpdateProductRequest,
)
from utils.cache import cached


@cached(ttl_seconds=60)
def list_products(conn: connection) -> list[dict]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT
                id,
                sku,
                name,
                description,
                category,
                price_cents,
                stock_quantity,
                image_url,
                is_active,
                rating,
                reviews,
                story,
                material,
                origin,
                dimensions,
                care
            FROM products
            WHERE is_active = TRUE
            ORDER BY created_at DESC
            """
        )
        return cur.fetchall()


@cached(ttl_seconds=60)
def get_product(conn: connection, product_id: str) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT
                id,
                sku,
                name,
                description,
                category,
                price_cents,
                stock_quantity,
                image_url,
                is_active,
                rating,
                reviews,
                story,
                material,
                origin,
                dimensions,
                care
            FROM products
            WHERE id = %s
            """,
            (product_id,),
        )

        product = cur.fetchone()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


def _escape_like(query: str) -> str:
    # Without this, a literal % or _ in the search text is treated as a SQL
    # wildcard instead of the character the user actually typed.
    return query.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


@cached(ttl_seconds=60)
def search_products(conn: connection, query: str) -> list[dict]:
    pattern = f"%{_escape_like(query)}%"

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT
                id,
                sku,
                name,
                description,
                category,
                price_cents,
                stock_quantity,
                image_url,
                is_active,
                rating,
                reviews,
                story,
                material,
                origin,
                dimensions,
                care
            FROM products
            WHERE
                is_active = TRUE
                AND (
                    LOWER(name) LIKE LOWER(%s) ESCAPE '\\'
                    OR LOWER(category) LIKE LOWER(%s) ESCAPE '\\'
                )
            ORDER BY name
            """,
            (pattern, pattern),
        )

        return cur.fetchall()


def create_product(
    conn: connection,
    data: CreateProductRequest,
    created_by: str,
) -> dict:

    with conn.cursor(cursor_factory=RealDictCursor) as cur:

        cur.execute(
            """
            SELECT id
            FROM products
            WHERE sku = %s
            """,
            (data.sku,),
        )

        if cur.fetchone():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="SKU already exists",
            )

        cur.execute(
            """
            INSERT INTO products
            (
                id,
                sku,
                name,
                description,
                category,
                price_cents,
                stock_quantity,
                image_url,
                is_active,
                rating,
                reviews,
                story,
                material,
                origin,
                dimensions,
                care,
                created_by,
                created_at,
                updated_at
            )
            VALUES
            (
                %s,%s,%s,%s,%s,%s,%s,%s,TRUE,%s,%s,%s,%s,%s,%s,%s,%s,now(),now()
            )
            RETURNING
                id,
                sku,
                name,
                description,
                category,
                price_cents,
                stock_quantity,
                image_url,
                is_active,
                rating,
                reviews,
                story,
                material,
                origin,
                dimensions,
                care
            """,
            (
                str(uuid4()),
                data.sku,
                data.name,
                data.description,
                data.category,
                data.price_cents,
                data.stock_quantity,
                data.image_url,
                data.rating,
                data.reviews,
                data.story,
                data.material,
                data.origin,
                data.dimensions,
                data.care,
                created_by,
            ),
        )

        return cur.fetchone()


def update_product(
    conn: connection,
    product_id: str,
    data: UpdateProductRequest,
) -> dict:

    with conn.cursor(cursor_factory=RealDictCursor) as cur:

        cur.execute(
            """
            UPDATE products
            SET
                sku = COALESCE(%s, sku),
                name = COALESCE(%s, name),
                description = COALESCE(%s, description),
                category = COALESCE(%s, category),
                price_cents = COALESCE(%s, price_cents),
                stock_quantity = COALESCE(%s, stock_quantity),
                image_url = COALESCE(%s, image_url),
                is_active = COALESCE(%s, is_active),
                rating = COALESCE(%s, rating),
                reviews = COALESCE(%s, reviews),
                story = COALESCE(%s, story),
                material = COALESCE(%s, material),
                origin = COALESCE(%s, origin),
                dimensions = COALESCE(%s, dimensions),
                care = COALESCE(%s, care),
                updated_at = now()
            WHERE id = %s
            RETURNING
                id,
                sku,
                name,
                description,
                category,
                price_cents,
                stock_quantity,
                image_url,
                is_active,
                rating,
                reviews,
                story,
                material,
                origin,
                dimensions,
                care
            """,
            (
                data.sku,
                data.name,
                data.description,
                data.category,
                data.price_cents,
                data.stock_quantity,
                data.image_url,
                data.is_active,
                data.rating,
                data.reviews,
                data.story,
                data.material,
                data.origin,
                data.dimensions,
                data.care,
                product_id,
            ),
        )

        product = cur.fetchone()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


def delete_product(conn: connection, product_id: str) -> None:
    with conn.cursor() as cur:
        try:
            cur.execute("DELETE FROM products WHERE id = %s", (product_id,))
        except psycopg2.errors.ForeignKeyViolation:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This product has existing orders and cannot be deleted. "
                "Deactivate it instead.",
            )

        if cur.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )


def _create_payment(
    cur,
    payer_id: str,
    amount_cents: int,
) -> str:

    payment_id = str(uuid4())

    cur.execute(
        """
        INSERT INTO payments
        (
            id,
            payer_id,
            purpose,
            amount_cents,
            currency,
            status,
            gateway_reference,
            created_at
        )
        VALUES
        (
            %s,
            %s,
            'shop_order',
            %s,
            'INR',
            'initiated',
            %s,
            now()
        )
        """,
        (
            payment_id,
            payer_id,
            amount_cents,
            f"DUMMY-{payment_id[:8]}",
        ),
    )

    return payment_id

def _log_inventory(
    cur,
    product_id: str,
    quantity: int,
    user_id: str,
):

    cur.execute(
        """
        INSERT INTO inventory_logs
        (
            id,
            product_id,
            change_qty,
            reason,
            created_by,
            created_at
        )
        VALUES
        (
            %s,
            %s,
            %s,
            'Shop Order',
            %s,
            now()
        )
        """,
        (
            str(uuid4()),
            product_id,
            -quantity,
            user_id,
        ),
    )

def create_order(
    conn: connection,
    customer_id: str,
    data: CreateOrderRequest,
) -> dict:

    with conn.cursor(cursor_factory=RealDictCursor) as cur:

        total_cents = 0
        order_items = []

        # Check-and-decrement stock atomically in one statement so two
        # concurrent orders can't both pass a "there's enough stock" check
        # against the same remaining unit before either commits.
        for item in data.items:

            cur.execute(
                """
                UPDATE products
                SET
                    stock_quantity = stock_quantity - %s,
                    updated_at = now()
                WHERE id = %s
                AND is_active = TRUE
                AND stock_quantity >= %s
                RETURNING id, name, price_cents
                """,
                (item.quantity, str(item.product_id), item.quantity),
            )

            product = cur.fetchone()

            if not product:
                cur.execute(
                    "SELECT name FROM products WHERE id = %s AND is_active = TRUE",
                    (str(item.product_id),),
                )
                existing = cur.fetchone()

                if not existing:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Product not found",
                    )

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for {existing['name']}",
                )

            subtotal = product["price_cents"] * item.quantity
            total_cents += subtotal

            order_items.append(
                {
                    "product": product,
                    "quantity": item.quantity,
                }
            )

        # Create payment
        payment_id = _create_payment(
            cur,
            customer_id,
            total_cents,
        )

        order_id = str(uuid4())

        # Create order
        cur.execute(
            """
            INSERT INTO orders
            (
                id,
                customer_id,
                status,
                total_cents,
                shipping_address,
                payment_id,
                placed_at
            )
            VALUES
            (
                %s,
                %s,
                'pending',
                %s,
                %s,
                %s,
                now()
            )
            RETURNING
                id,
                customer_id,
                status,
                total_cents,
                shipping_address
            """,
            (
                order_id,
                customer_id,
                total_cents,
                data.shipping_address,
                payment_id,
            ),
        )

        order = cur.fetchone()

        # Create order items
        for item in order_items:

            cur.execute(
                """
                INSERT INTO order_items
                (
                    id,
                    order_id,
                    product_id,
                    quantity,
                    unit_price_cents
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                )
                """,
                (
                    str(uuid4()),
                    order_id,
                    item["product"]["id"],
                    item["quantity"],
                    item["product"]["price_cents"],
                ),
            )

            # Stock was already decremented atomically above, alongside the
            # availability check - just log it here.
            # Inventory log
            _log_inventory(
                cur,
                str(item["product"]["id"]),
                item["quantity"],
                customer_id,
            )

        return order


def get_order_history(
    conn: connection,
    customer_id: str,
) -> list[dict]:

    with conn.cursor(cursor_factory=RealDictCursor) as cur:

        cur.execute(
            """
            SELECT
                o.id,
                o.status,
                o.total_cents,
                o.shipping_address,
                o.placed_at,
                p.status AS payment_status
            FROM orders o
            JOIN payments p
                ON o.payment_id = p.id
            WHERE o.customer_id = %s
            ORDER BY o.placed_at DESC
            """,
            (customer_id,),
        )

        return cur.fetchall()


def get_all_orders(
    conn: connection,
) -> list[dict]:

    with conn.cursor(cursor_factory=RealDictCursor) as cur:

        cur.execute(
            """
            SELECT
                o.id,
                u.full_name,
                u.email,
                o.status,
                o.total_cents,
                o.shipping_address,
                o.placed_at,
                p.status AS payment_status
            FROM orders o
            JOIN users u
                ON o.customer_id = u.id
            JOIN payments p
                ON o.payment_id = p.id
            ORDER BY o.placed_at DESC
            """
        )

        return cur.fetchall()