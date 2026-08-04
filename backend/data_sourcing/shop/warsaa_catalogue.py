from __future__ import annotations

import logging
import re
from pathlib import Path

import fitz
import requests

from data_sourcing.shop.product_models import RAW_DIR, RawProduct, dump_raw_products

logger = logging.getLogger(__name__)

CATALOGUE_URL = "https://www.intachpune.org/images/warsaa-catalogue.pdf"
USER_AGENT = "INTACHPuneHeritagePlatform/1.0 (contact: intachpune@gmail.com)"

# Product photos have no independent public URL - they only exist embedded in
# this PDF - so they're extracted to local files and served by the backend's
# own /static mount rather than left unset.
STATIC_DIR = Path(__file__).parent.parent.parent / "static" / "products" / "warsaa"
STATIC_URL_PREFIX = "/static/products/warsaa"

# The hyphen before "Rs." is present on almost every line but is missing on
# at least one ("Lamp Shades Rs.800/- onwards") - making it optional avoids
# that line's price being silently swallowed into the *next* item's name.
# "Rs\.*" (not "Rs\.?") because one line has a doubled-dot typo ("Rs..450/-")
# that would otherwise silently drop that item entirely.
ITEM_PATTERN = re.compile(
    r"(?P<name>.+?)\s*-?\s*Rs\.*\s*(?P<price>[\d,]+)"
    r"(?:\s*to\s*Rs\.*\s*(?P<price_to>[\d,]+))?"
    r"\s*/?-?\s*(?P<qualifier>onwards|each)?",
)


def fetch_pdf_bytes(url: str = CATALOGUE_URL) -> bytes:
    response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=30)
    response.raise_for_status()
    return response.content


def _slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "item"


def _block_quadrant(bbox: tuple[float, float, float, float], page_width: float, page_height: float) -> tuple[str, str]:
    x_mid = (bbox[0] + bbox[2]) / 2
    y_mid = (bbox[1] + bbox[3]) / 2
    horizontal = "left" if x_mid < page_width / 2 else "right"
    vertical = "top" if y_mid < page_height / 2 else "bottom"
    return horizontal, vertical


def _describe_price(price_rupees: int, price_to: str | None, qualifier: str | None) -> str | None:
    if price_to:
        return f"Price varies by variant - Rs.{price_rupees} to Rs.{price_to.replace(',', '')}"
    if qualifier == "onwards":
        return f"Price varies by variant - starting from Rs.{price_rupees}"
    if qualifier == "each":
        return f"Rs.{price_rupees} each"
    return None


def _parse_page(page: "fitz.Page", images_dir: Path) -> list[RawProduct]:
    page_dict = page.get_text("dict")
    text_blocks = [b for b in page_dict["blocks"] if b.get("type") == 0]
    if not text_blocks:
        return []

    # The category heading sits alone above the 2x2 grid of item tiles - it's
    # reliably the topmost text block and never matches the price pattern.
    text_blocks.sort(key=lambda b: b["bbox"][1])
    category_block, item_blocks = text_blocks[0], text_blocks[1:]
    category = "".join(
        span["text"] for line in category_block["lines"] for span in line["spans"]
    ).strip()
    if not category:
        return []

    # Group embedded images by which quadrant of the page they sit in, so
    # images can be matched to the item tile physically next to them instead
    # of assigned arbitrarily.
    images_by_quadrant: dict[tuple[str, str], list[int]] = {}
    for img in page.get_images(full=True):
        xref = img[0]
        rects = page.get_image_rects(xref)
        if not rects:
            continue
        quadrant = _block_quadrant(tuple(rects[0]), page.rect.width, page.rect.height)
        images_by_quadrant.setdefault(quadrant, []).append(xref)

    products: list[RawProduct] = []
    for block in item_blocks:
        quadrant = _block_quadrant(block["bbox"], page.rect.width, page.rect.height)
        quadrant_images = images_by_quadrant.get(quadrant, [])

        block_text = " ".join(
            "".join(span["text"] for span in line["spans"]) for line in block["lines"]
        )
        items = list(ITEM_PATTERN.finditer(block_text))
        for idx, match in enumerate(items):
            name = match.group("name").strip(" -")
            if not name:
                continue
            price_rupees = int(match.group("price").replace(",", ""))
            description = _describe_price(
                price_rupees, match.group("price_to"), match.group("qualifier")
            )

            image_url = None
            if quadrant_images:
                xref = quadrant_images[idx % len(quadrant_images)]
                image_url = _extract_image(page.parent, xref, images_dir, name)

            products.append(
                RawProduct(
                    name=name,
                    category=category,
                    price_cents=price_rupees * 100,
                    source="warsaa_catalogue",
                    description=description,
                    image_url=image_url,
                    product_url=CATALOGUE_URL,
                )
            )

    return products


def _extract_image(doc: "fitz.Document", xref: int, images_dir: Path, name: str) -> str | None:
    try:
        image = doc.extract_image(xref)
    except Exception:
        logger.exception("Failed to extract embedded image xref=%s for %r", xref, name)
        return None

    images_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{_slugify(name)}-{xref}.{image['ext']}"
    (images_dir / filename).write_bytes(image["image"])
    return f"{STATIC_URL_PREFIX}/{filename}"


def parse_catalogue(pdf_bytes: bytes, images_dir: Path = STATIC_DIR) -> list[RawProduct]:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    products: list[RawProduct] = []
    # Page 0 is the cover/intro page - it describes the shop, not products.
    for page in doc.pages(1):
        products.extend(_parse_page(page, images_dir))

    if not products:
        logger.error(
            "Warsaa catalogue parse yielded 0 products - the PDF layout has likely changed"
        )
    return products


def fetch() -> list[RawProduct]:
    return parse_catalogue(fetch_pdf_bytes())


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    result = fetch()
    dump_raw_products(result, RAW_DIR / "warsaa_catalogue.json")
    logger.info("Parsed %d products from Warsaa catalogue", len(result))
