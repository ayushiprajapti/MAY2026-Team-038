from __future__ import annotations

import logging
import math
import re
import time
from dataclasses import replace
from urllib.parse import quote

import requests
from bs4 import BeautifulSoup

from data_sourcing.heritage.models import RAW_DIR, RawSite, dump_raw_sites

logger = logging.getLogger(__name__)

USER_AGENT = "INTACHPuneHeritagePlatform/1.0 (contact: intachpune@gmail.com)"

# How far a Wikidata entity's own coordinates may be from the site we searched
# for before we refuse to trust its image as belonging to the same place.
IMAGE_MATCH_DISTANCE_METERS = 2000.0


def _distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371000.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * radius * math.asin(math.sqrt(a))

GRADE_PAGES = {
    "Grade I": "https://en.wikipedia.org/wiki/List_of_Grade_I_heritage_structures_in_Pune",
    "Grade II": "https://en.wikipedia.org/wiki/List_of_Grade_II_heritage_structures_in_Pune",
    "Grade III": "https://en.wikipedia.org/wiki/List_of_Grade_III_heritage_structures_in_Pune",
}

COORDINATE_PATTERN = re.compile(r"(\d+\.\d+)\s*°\s*N.*?(\d+\.\d+)\s*°\s*E")
DMS_PATTERN = re.compile(r"\d+°\d+′\d+″\s*N")
FOOTNOTE_PATTERN = re.compile(r"\[\s*\d+\s*\]")


def fetch(fetch_images: bool = True) -> list[RawSite]:
    sites: list[RawSite] = []
    for grade, url in GRADE_PAGES.items():
        sites.extend(_parse_grade_page(grade, url))

    if not sites:
        logger.error(
            "PMC/Wikidata scrape yielded 0 sites across all %d grade pages - "
            "the Wikipedia page structure has likely changed",
            len(GRADE_PAGES),
        )

    if not fetch_images:
        return sites

    enriched: list[RawSite] = []
    for site in sites:
        image_url = _lookup_wikidata_image(site.name, site.latitude, site.longitude)
        enriched.append(replace(site, image_url=image_url) if image_url else site)
        time.sleep(0.2)
    return enriched


def _parse_grade_page(grade: str, url: str) -> list[RawSite]:
    response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=30)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    table = soup.find("table", class_="wikitable")
    if table is None:
        logger.warning("No wikitable found on %s", url)
        return []

    rows = table.find_all("tr")
    if not rows:
        return []

    header_cells = [c.get_text(strip=True).lower() for c in rows[0].find_all(["th", "td"])]
    location_idx = next((i for i, h in enumerate(header_cells) if "location" in h), 2)
    notes_idx = next(
        (i for i, h in enumerate(header_cells) if "note" in h or "description" in h), None
    )

    sites = []
    for row in rows[1:]:
        cells = row.find_all(["td", "th"])
        if len(cells) <= location_idx:
            continue
        try:
            site = _parse_row(grade, cells, location_idx, notes_idx)
        except Exception as exc:  # noqa: BLE001 - keep scraping the rest of the table
            logger.warning("Skipping row on %s: %s", url, exc)
            continue
        if site:
            sites.append(site)

    if not sites:
        logger.warning(
            "Parsed 0 sites from %s despite finding a table - the column layout"
            " may have changed (expected a 'Location' header column)",
            url,
        )
    return sites


def _parse_row(
    grade: str, cells: list, location_idx: int, notes_idx: int | None
) -> RawSite | None:
    name = cells[0].get_text(strip=True)
    location_text = cells[location_idx].get_text(" ", strip=True)
    notes = (
        cells[notes_idx].get_text(" ", strip=True)
        if notes_idx is not None and len(cells) > notes_idx
        else None
    )
    if notes:
        notes = FOOTNOTE_PATTERN.sub("", notes).strip() or None

    coord_match = COORDINATE_PATTERN.search(location_text)
    if not name or not coord_match:
        return None

    latitude, longitude = float(coord_match.group(1)), float(coord_match.group(2))

    address_end = coord_match.start()
    dms_match = DMS_PATTERN.search(location_text)
    if dms_match and dms_match.start() < address_end:
        address_end = dms_match.start()
    address = location_text[:address_end].strip(" ,﻿") or None

    return RawSite(
        name=name,
        latitude=latitude,
        longitude=longitude,
        source="pmc_wikidata",
        grade=grade,
        address=address,
        description=notes,
    )


def _lookup_wikidata_image(name: str, latitude: float, longitude: float) -> str | None:
    try:
        search = requests.get(
            "https://www.wikidata.org/w/api.php",
            params={
                "action": "wbsearchentities",
                "search": f"{name} Pune",
                "language": "en",
                "format": "json",
                "limit": 1,
            },
            headers={"User-Agent": USER_AGENT},
            timeout=15,
        ).json()
        results = search.get("search") or []
        if not results:
            return None
        qid = results[0]["id"]

        entity = requests.get(
            "https://www.wikidata.org/w/api.php",
            params={
                "action": "wbgetentities",
                "ids": qid,
                "props": "claims",
                "format": "json",
            },
            headers={"User-Agent": USER_AGENT},
            timeout=15,
        ).json()
        claims = entity["entities"][qid]["claims"]

        coord_claim = claims.get("P625")
        if not coord_claim:
            # Can't confirm this is the same physical site - don't risk
            # attaching an unrelated entity's image.
            return None
        coord_value = coord_claim[0]["mainsnak"]["datavalue"]["value"]
        distance = _distance_meters(
            latitude, longitude, coord_value["latitude"], coord_value["longitude"]
        )
        if distance > IMAGE_MATCH_DISTANCE_METERS:
            logger.debug(
                "Rejecting Wikidata match for %s: %.0fm away from expected location",
                name, distance,
            )
            return None

        image_claim = claims.get("P18")
        if not image_claim:
            return None
        filename = image_claim[0]["mainsnak"]["datavalue"]["value"]
        return f"https://commons.wikimedia.org/wiki/Special:FilePath/{quote(filename)}"
    except Exception as exc:  # noqa: BLE001 - image enrichment is best-effort
        logger.debug("Wikidata lookup failed for %s: %s", name, exc)
        return None


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    result = fetch()
    dump_raw_sites(result, RAW_DIR / "pmc_wikidata.json")
    logger.info("Fetched %d sites from PMC/Wikidata", len(result))
