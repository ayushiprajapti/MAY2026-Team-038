from __future__ import annotations

import logging
from typing import Callable, TypeVar

import psycopg2

from config import settings
from data_sourcing.shop import ecoexist, gaatha_tambat, mahatribes, product_loader, warsaa_catalogue
from data_sourcing.shop.product_models import RAW_DIR, RawProduct, dump_raw_products

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

T = TypeVar("T")


def _safe_fetch(label: str, fetch_fn: Callable[[], T], default: T) -> T:
    try:
        return fetch_fn()
    except Exception:
        logger.exception("Failed to fetch %s - continuing with what we already have", label)
        return default


def main() -> None:
    all_products: list[RawProduct] = []

    for label, fetch_fn, filename in [
        ("Warsaa catalogue", warsaa_catalogue.fetch, "warsaa_catalogue.json"),
        ("eCoexist", ecoexist.fetch, "ecoexist.json"),
        ("Gaatha Tambat", gaatha_tambat.fetch, "gaatha_tambat.json"),
        ("Mahatribes", mahatribes.fetch, "mahatribes.json"),
    ]:
        logger.info("Fetching %s products...", label)
        products = _safe_fetch(label, fetch_fn, [])
        dump_raw_products(products, RAW_DIR / filename)
        logger.info("Fetched %d %s products", len(products), label)
        all_products.extend(products)

    normalized = product_loader.normalize(all_products)

    conn = psycopg2.connect(settings.database_url)
    try:
        summary = product_loader.load(conn, normalized)
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    logger.info("Load complete: %s", summary)


if __name__ == "__main__":
    main()
