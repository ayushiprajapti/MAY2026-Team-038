from __future__ import annotations

import json
import logging
import re

import requests
from bs4 import BeautifulSoup

from data_sourcing.models import RAW_DIR

logger = logging.getLogger(__name__)

USER_AGENT = "INTACHPuneHeritagePlatform/1.0 (contact: intachpune@gmail.com)"

INTACH_PAGES = [
    "https://www.intachpune.org/pune-heritage1.html",
    "https://www.intachpune.org/built-heritage-walks1.html",
    "https://www.intachpune.org/pune-heritage-walks.html",
]


def fetch_intach_pages(urls: list[str] | None = None) -> dict[str, str]:
    pages: dict[str, str] = {}
    for url in urls or INTACH_PAGES:
        try:
            pages[url] = _fetch_page_text(url)
        except Exception as exc:  # noqa: BLE001 - one bad page shouldn't stop the rest
            logger.warning("Failed to fetch %s: %s", url, exc)
    return pages


def _fetch_page_text(url: str) -> str:
    response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=30)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    for tag in soup(["script", "style", "nav", "header", "footer"]):
        tag.decompose()
    return re.sub(r"\s+", " ", soup.get_text(" ", strip=True))


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    fetched_pages = fetch_intach_pages()
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    (RAW_DIR / "intach_pages.json").write_text(
        json.dumps(fetched_pages, indent=2, ensure_ascii=False)
    )
    logger.info("Fetched %d INTACH pages", len(fetched_pages))
