from __future__ import annotations

import logging
import time

import requests

from data_sourcing.models import RAW_DIR, RawSite, dump_raw_sites

logger = logging.getLogger(__name__)

USER_AGENT = "INTACHPuneHeritagePlatform/1.0 (contact: intachpune@gmail.com)"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# A lat/lon bounding box covering roughly a 150km radius around Pune's
# centre (18.5204N 73.8567E) - big enough to reach the Konkan coast forts,
# Sinhagad/Torna/Shivneri, and Mahabaleshwar/Panchgani, matching INTACH
# Pune's actual coverage area beyond just city limits. Using a bbox instead
# of an administrative-boundary area() lookup avoids Overpass having to
# compute a polygon server-side, which was timing out (504) against the
# public overpass-api.de instance even at city scale.
PUNE_BBOX = "17.1729,72.4356,19.8679,75.2778"

# `historic=heritage`/`heritage=*` (an explicit heritage-list designation) has
# no coverage at all in Pune's OSM data - confirmed empty on a live query.
# These broader `historic=*` subtypes are the actual heritage-adjacent things
# OSM has for Pune (memorials, monuments, city gates, forts...). Deliberately
# excludes noisy/out-of-scope tags: `amenity=place_of_worship` (every modern
# temple/mosque/church, not just historic ones), vehicle/wreck displays
# (aircraft, ship), and trivial roadside markers (milestone, boundary_stone).
# Anything pulled in here that isn't a real heritage site gets caught by a
# human reviewer anyway, since unmatched OSM sites load as `pending_review`.
HISTORIC_TAG_VALUES = [
    "heritage", "monument", "memorial", "building", "castle", "fort", "ruins",
    "tomb", "city_gate", "city_wall", "tower", "wayside_shrine",
    "archaeological_site", "manor",
]

_HISTORIC_CLAUSES = "".join(
    f'node["historic"="{value}"]({PUNE_BBOX});way["historic"="{value}"]({PUNE_BBOX});'
    f'rel["historic"="{value}"]({PUNE_BBOX});'
    for value in HISTORIC_TAG_VALUES
)

QUERY = f"""
[out:json][timeout:120];
(
  {_HISTORIC_CLAUSES}
  node["heritage"]({PUNE_BBOX});
  way["heritage"]({PUNE_BBOX});
  rel["heritage"]({PUNE_BBOX});
);
out center tags;
"""


MAX_ATTEMPTS = 4
RETRY_DELAY_SECONDS = 15.0
REQUEST_TIMEOUT_SECONDS = 150.0


def fetch() -> list[RawSite]:
    response = None
    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            response = requests.post(
                OVERPASS_URL,
                data={"data": QUERY},
                headers={"User-Agent": USER_AGENT},
                timeout=REQUEST_TIMEOUT_SECONDS,
            )
            response.raise_for_status()
            break
        except requests.exceptions.RequestException as exc:
            if attempt == MAX_ATTEMPTS:
                raise
            logger.warning(
                "Overpass request failed (attempt %d/%d): %s - retrying in %.0fs",
                attempt, MAX_ATTEMPTS, exc, RETRY_DELAY_SECONDS,
            )
            time.sleep(RETRY_DELAY_SECONDS)

    elements = response.json().get("elements", [])

    sites = []
    for element in elements:
        site = _parse_element(element)
        if site:
            sites.append(site)
    return sites


# OSM names that are just the generic type-word ("Mandir" = temple in
# Marathi/Hindi) rather than an actual site name. Real coordinates for real
# small shrines, but with no identifying name they're not useful entries -
# dozens of unrelated wayside shrines across a 150km radius all end up
# looking like the exact same "site" if kept.
GENERIC_OSM_NAMES = {
    "mandir", "dargah", "rajwada", "wada", "temple", "shrine", "mosque",
    "church", "chapel", "well", "stepwell", "memorial", "monument",
    "statue", "fort", "cave", "caves", "tomb", "samadhi", "gate", "tower",
}


def _parse_element(element: dict) -> RawSite | None:
    tags = element.get("tags", {})
    name = tags.get("name")
    if not name or name.strip().lower() in GENERIC_OSM_NAMES:
        return None

    if element["type"] == "node":
        latitude, longitude = element.get("lat"), element.get("lon")
    else:
        # ways and relations only carry a computed centroid, via `out center`
        center = element.get("center", {})
        latitude, longitude = center.get("lat"), center.get("lon")

    if latitude is None or longitude is None:
        return None

    address_parts = [
        tags.get("addr:housenumber"),
        tags.get("addr:street"),
        tags.get("addr:city"),
    ]
    address = ", ".join(part for part in address_parts if part) or None

    return RawSite(
        name=name,
        latitude=float(latitude),
        longitude=float(longitude),
        source="osm",
        address=address,
        description=tags.get("description"),
        historic_type=tags.get("historic"),
    )


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    result = fetch()
    dump_raw_sites(result, RAW_DIR / "osm.json")
    logger.info("Fetched %d sites from OSM", len(result))
