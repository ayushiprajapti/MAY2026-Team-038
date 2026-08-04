from __future__ import annotations

import logging
import re

from playwright.sync_api import Page, sync_playwright

from data_sourcing.shop.product_models import RAW_DIR, RawProduct, dump_raw_products

logger = logging.getLogger(__name__)

# Mahatribes is a government (Tribal Research and Training Institute, Pune)
# marketplace for tribal artisans/SHGs - see mahatribes.com. Scoped to
# categories that fit a heritage-shop assortment (craft artifacts, paintings,
# heritage textiles, home decor); "Food & Essentials" and "Book" are skipped
# deliberately - perishables and generic books don't fit alongside Warsaa's
# souvenir/craft assortment.
CATEGORY_URLS: dict[str, str] = {
    "Artifacts": "https://mahatribes.com/categories/artifacts/artifacts-decorative/all-decorative-product",
    "Artifacts (Wood Craft)": "https://mahatribes.com/categories/artifacts/wood-craft/all-wood-craft",
    "Art & Paintings (Warli)": "https://mahatribes.com/categories/paintings/warli/paintings-paintings-warli-all-painting",
    "Art & Paintings (Gond)": "https://mahatribes.com/categories/paintings/paintings-gond/all-painting",
    "Art & Paintings (Saurashtra)": "https://mahatribes.com/categories/paintings/saurashtra/paintings-saurashtra-all-painting",
    "Art & Paintings (Framed)": "https://mahatribes.com/categories/paintings/paintings-frames-painting/paintings-frames-painting-all-painting",
    "Clothing": "https://mahatribes.com/categories/clothing-apparel/clothing-apparel-tribes-heritage/applique-tanka-work",
    "Clothing (Bagh/Maheshwari)": "https://mahatribes.com/categories/clothing-apparel/clothing-apparel-tribes-heritage/bagh-maheshwari",
    "Clothing (Chanderi)": "https://mahatribes.com/categories/clothing-apparel/clothing-apparel-tribes-heritage/chanderi",
    "Clothing (Eri/Tussar Silk)": "https://mahatribes.com/categories/clothing-apparel/clothing-apparel-tribes-heritage/eri-tussar-silk",
    "Home & Living": "https://mahatribes.com/categories/home-living/home-living-decoratives/home-living-decoratives-all-decorative-product",
    "Home & Living (Wall Hanging)": "https://mahatribes.com/categories/home-living/home-living-wall-hanging/all-wall-hanging",
}

PRICE_PATTERN = re.compile(r"₹\s*([\d,]+(?:\.\d{2})?)")
MAX_LOAD_MORE_CLICKS = 10


def _load_all_products(page: Page) -> None:
    for _ in range(MAX_LOAD_MORE_CLICKS):
        button = page.get_by_text("Load more", exact=False)
        if button.count() == 0 or not button.first.is_visible():
            return
        count_before = len(page.query_selector_all(".woo_product_grid"))
        button.first.click()
        page.wait_for_timeout(1500)
        if len(page.query_selector_all(".woo_product_grid")) <= count_before:
            return


def _parse_price_cents(text: str) -> int | None:
    # The discounted (current) price renders before the struck-through
    # original price in the same element - the first match is what a buyer
    # actually pays.
    match = PRICE_PATTERN.search(text)
    if not match:
        return None
    return round(float(match.group(1).replace(",", "")) * 100)


def _fetch_category(page: Page, category: str, url: str) -> list[RawProduct]:
    page.goto(url, wait_until="load", timeout=45000)
    page.wait_for_timeout(2000)
    _load_all_products(page)

    products: list[RawProduct] = []
    for card in page.query_selector_all(".woo_product_grid"):
        name_el = card.query_selector("h4.entry-title")
        price_el = card.query_selector(".woo_price")
        link_el = card.query_selector("a[href]")
        if name_el is None or price_el is None:
            continue

        price_cents = _parse_price_cents(price_el.inner_text())
        if price_cents is None:
            logger.warning("Skipping item with unparseable price: %r", name_el.inner_text())
            continue

        img = card.query_selector("img")
        products.append(
            RawProduct(
                name=name_el.inner_text().strip(),
                category=category,
                price_cents=price_cents,
                source="mahatribes",
                description=(
                    "Sold via Maha Tribes, a Maharashtra Tribal Research and Training "
                    "Institute marketplace supporting tribal artisans and self-help groups."
                ),
                image_url=(img.get_attribute("data-src") or img.get_attribute("src")) if img else None,
                product_url=link_el.get_attribute("href") if link_el else None,
            )
        )
    return products


def fetch() -> list[RawProduct]:
    products: list[RawProduct] = []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            for category, url in CATEGORY_URLS.items():
                try:
                    products.extend(_fetch_category(page, category, url))
                except Exception:
                    logger.exception("Failed to fetch Mahatribes category %r at %s", category, url)
        finally:
            browser.close()

    if not products:
        logger.error("Mahatribes scrape yielded 0 products - the site structure has likely changed")
    return products


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    result = fetch()
    dump_raw_products(result, RAW_DIR / "mahatribes.json")
    logger.info("Fetched %d products from Mahatribes", len(result))
