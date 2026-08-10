from __future__ import annotations

import logging
import re

from playwright.sync_api import sync_playwright

from data_sourcing.shop.product_models import RAW_DIR, RawProduct, dump_raw_products

logger = logging.getLogger(__name__)

# Coppre is Gaatha's brand for Pune's own Tambat Ali copper craftspeople - see
# shop.gaatha.com/buy-online-copper-items-20 for the community writeup. Using
# this manufacturer-scoped page (not the general "copper" category) keeps
# this to Pune craft specifically, not Gaatha's broader all-India catalogue.
COPPRE_MANUFACTURER_URL = "https://shop.gaatha.com/manufacturer/handmade-copper-products-by-coppre"

PRICE_PATTERN = re.compile(r"([\d,]+\.\d{2}|[\d,]+)")


def _select_inr(page) -> None:
    inr = page.query_selector('a.currency-select[data-name="INR"]')
    if inr is None:
        logger.warning("INR currency option not found - prices may be in the wrong currency")
        return
    # A plain Playwright .click() fails here because the dropdown option is
    # hidden until its parent menu is opened; the site's own delegated click
    # handler doesn't care about visibility, so dispatch the event directly.
    inr.evaluate("el => el.click()")
    page.wait_for_timeout(2000)


def _parse_price_cents(text: str) -> int | None:
    match = PRICE_PATTERN.search(text)
    if not match:
        return None
    return round(float(match.group(1).replace(",", "")) * 100)


def fetch() -> list[RawProduct]:
    products: list[RawProduct] = []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            page.goto(COPPRE_MANUFACTURER_URL, wait_until="load", timeout=45000)
            page.wait_for_timeout(2000)
            _select_inr(page)

            for item in page.query_selector_all(".product-layout"):
                name_el = item.query_selector(".name a") or item.query_selector("h4 a")
                price_el = item.query_selector(".price")
                if name_el is None or price_el is None:
                    continue

                price_cents = _parse_price_cents(price_el.inner_text())
                if price_cents is None:
                    logger.warning("Skipping item with unparseable price: %r", name_el.inner_text())
                    continue

                img = item.query_selector("img")
                # Below-the-fold images are lazyloaded: `src` is a blank
                # base64 placeholder until the element scrolls into view, and
                # `data-src` holds the real URL the whole time.
                image_url = img.get_attribute("data-src") or img.get_attribute("src") if img else None
                products.append(
                    RawProduct(
                        name=name_el.inner_text().strip(),
                        category="Metalware",
                        price_cents=price_cents,
                        source="gaatha_tambat",
                        description=(
                            "Handcrafted by Pune's Tambat Ali copper artisan community, "
                            "sold via Gaatha's Coppre collection."
                        ),
                        image_url=image_url,
                        product_url=name_el.get_attribute("href"),
                    )
                )
        finally:
            browser.close()

    if not products:
        logger.error("Gaatha Tambat scrape yielded 0 products - the page structure has likely changed")
    return products


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    result = fetch()
    dump_raw_products(result, RAW_DIR / "gaatha_tambat.json")
    logger.info("Fetched %d products from Gaatha (Coppre/Tambat)", len(result))
