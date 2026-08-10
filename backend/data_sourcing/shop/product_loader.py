from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from uuid import uuid4

from psycopg2.extensions import connection

from data_sourcing.shop.product_models import RAW_DIR, RawProduct, load_raw_products

logger = logging.getLogger(__name__)

# The team manages real inventory counts themselves once products are seeded
# - this is only a placeholder so scraped-in products aren't shown as
# permanently out of stock before anyone has set a real quantity.
DEFAULT_STOCK_QUANTITY = 10

RAW_FILENAMES = [
    "warsaa_catalogue.json",
    "ecoexist.json",
    "gaatha_tambat.json",
    "mahatribes.json",
]


@dataclass
class NormalizedProduct:
    sku: str
    name: str
    category: str
    price_cents: int
    description: str | None = None
    image_url: str | None = None
    stock_quantity: int = DEFAULT_STOCK_QUANTITY


def _slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "item"


def generate_skus(products: list[RawProduct]) -> list[str]:
    # Several sources repeat generic names (e.g. Mahatribes lists many rows
    # simply titled "Warli Painting") - a running per-base-slug counter keeps
    # every sku unique without needing the source site's own product id.
    seen: dict[str, int] = {}
    skus = []
    for product in products:
        base = f"{product.source}-{_slugify(product.name)}"
        seen[base] = seen.get(base, 0) + 1
        skus.append(base if seen[base] == 1 else f"{base}-{seen[base]}")
    return skus


def normalize(products: list[RawProduct]) -> list[NormalizedProduct]:
    return [
        NormalizedProduct(
            sku=sku,
            name=product.name,
            category=product.category,
            price_cents=product.price_cents,
            description=product.description,
            image_url=product.image_url,
            stock_quantity=product.stock_quantity or DEFAULT_STOCK_QUANTITY,
        )
        for product, sku in zip(products, generate_skus(products))
    ]


def upsert_product(conn: connection, product: NormalizedProduct) -> str:
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO products (
                id, sku, name, description, category, price_cents,
                stock_quantity, image_url, is_active, created_at, updated_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, TRUE, now(), now())
            ON CONFLICT (sku) DO UPDATE SET
                name = EXCLUDED.name,
                description = EXCLUDED.description,
                category = EXCLUDED.category,
                price_cents = EXCLUDED.price_cents,
                image_url = COALESCE(EXCLUDED.image_url, products.image_url),
                updated_at = now()
            RETURNING id
            """,
            (
                str(uuid4()),
                product.sku,
                product.name,
                product.description,
                product.category,
                product.price_cents,
                product.stock_quantity,
                product.image_url,
            ),
        )
        return cur.fetchone()[0]


def load(conn: connection, products: list[NormalizedProduct]) -> dict[str, int]:
    summary = {"total": len(products), "loaded": 0, "failed": 0}
    for product in products:
        with conn.cursor() as cur:
            cur.execute("SAVEPOINT product_upsert")
        try:
            upsert_product(conn, product)
            with conn.cursor() as cur:
                cur.execute("RELEASE SAVEPOINT product_upsert")
            summary["loaded"] += 1
        except Exception:
            logger.exception("Failed to load product %r", product.name)
            with conn.cursor() as cur:
                cur.execute("ROLLBACK TO SAVEPOINT product_upsert")
            summary["failed"] += 1
    return summary


def main() -> None:
    import psycopg2

    from config import settings

    logging.basicConfig(level=logging.INFO)

    raw_products: list[RawProduct] = []
    for filename in RAW_FILENAMES:
        path = RAW_DIR / filename
        if path.exists():
            raw_products.extend(load_raw_products(path))
        else:
            logger.warning("Missing raw file %s - run its scraper first", path)

    products = normalize(raw_products)

    conn = psycopg2.connect(settings.database_url)
    try:
        summary = load(conn, products)
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    logger.info("Load complete: %s", summary)


if __name__ == "__main__":
    main()
