from __future__ import annotations

import logging
import re
import time

import requests
from bs4 import BeautifulSoup

from data_sourcing.shop.product_models import RAW_DIR, RawProduct, dump_raw_products

logger = logging.getLogger(__name__)

USER_AGENT = "INTACHPuneHeritagePlatform/1.0 (contact: intachpune@gmail.com)"

# eCoexist's own "Pune Heritage Cloth Bag Series", launched with INTACH Pune
# in 2014 (see intachpune.org/warsaa1.html) - this tag is scoped to exactly
# that series, not eCoexist's much larger general eco-products catalogue.
PUNE_TAG_URL = "https://www.e-coexist.com/product-tag/pune/"

PRICE_PATTERN = re.compile(r"([\d,]+\.\d{2}|[\d,]+)")
STOCK_COUNT_PATTERN = re.compile(r"(\d+)\s*left in stock")


def _get_soup(url: str) -> BeautifulSoup:
    response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=30)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")


def _product_urls(listing_url: str) -> list[str]:
    soup = _get_soup(listing_url)
    urls = list(
        dict.fromkeys(
            a["href"]
            for item in soup.select("ul.products li.product")
            for a in [item.find("a", href=True)]
            if a
        )
    )
    if not urls:
        logger.warning("No product links found on %s - page structure may have changed", listing_url)
    return urls


def _parse_price_cents(price_block) -> int | None:
    if price_block is None:
        return None
    text = price_block.get_text(" ", strip=True)
    match = PRICE_PATTERN.search(text)
    if not match:
        return None
    rupees = float(match.group(1).replace(",", ""))
    return round(rupees * 100)


def _parse_stock_quantity(stock_block) -> int | None:
    if stock_block is None:
        return None
    match = STOCK_COUNT_PATTERN.search(stock_block.get_text(" ", strip=True))
    return int(match.group(1)) if match else None


def _parse_product(url: str) -> RawProduct | None:
    soup = _get_soup(url)

    title_el = soup.select_one("h1.product_title")
    if title_el is None:
        logger.warning("Skipping %s - no product title found", url)
        return None
    name = title_el.get_text(strip=True)

    price_cents = _parse_price_cents(soup.select_one("p.price"))
    if price_cents is None:
        logger.warning("Skipping %r - out of stock or no price listed", name)
        return None

    image_el = soup.select_one("div.woocommerce-product-gallery img")
    image_url = (image_el.get("src") if image_el else None) or None

    return RawProduct(
        name=name,
        category="Bags",
        price_cents=price_cents,
        source="ecoexist",
        description="Part of the Pune Heritage Cloth Bag Series, launched by INTACH Pune with eCoexist.",
        image_url=image_url,
        product_url=url,
        stock_quantity=_parse_stock_quantity(soup.select_one("p.stock")),
    )


def fetch() -> list[RawProduct]:
    products: list[RawProduct] = []
    for url in _product_urls(PUNE_TAG_URL):
        try:
            product = _parse_product(url)
        except Exception:
            logger.exception("Failed to parse eCoexist product at %s", url)
            continue
        if product:
            products.append(product)
        time.sleep(0.3)

    if not products:
        logger.error("eCoexist scrape yielded 0 products - the site structure has likely changed")
    return products


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    result = fetch()
    dump_raw_products(result, RAW_DIR / "ecoexist.json")
    logger.info("Fetched %d products from eCoexist", len(result))
