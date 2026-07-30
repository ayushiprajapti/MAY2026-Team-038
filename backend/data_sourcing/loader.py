from __future__ import annotations

import logging
import math
import re
from dataclasses import dataclass, field, replace
from difflib import SequenceMatcher
from uuid import uuid4

from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor

from data_sourcing.models import RAW_DIR, RawSite, load_raw_sites

logger = logging.getLogger(__name__)

MATCH_DISTANCE_METERS = 100.0
MATCH_NAME_SIMILARITY = 0.7

# Forts/caves/ruins are large enough that OSM's separate point (entrance
# node) and boundary way/relation for the *same* physical site can have
# centroids several hundred metres apart - e.g. Sinhagad Fort was loaded
# twice because its node and its way both cleared MATCH_NAME_SIMILARITY but
# were >100m apart. These tag types get a wider proximity allowance.
LARGE_FOOTPRINT_HISTORIC_TYPES = {
    "fort", "castle", "ruins", "archaeological_site", "city_wall", "manor",
}
WIDE_MATCH_DISTANCE_METERS = 500.0

# There's no human-review workflow built yet, so an unmatched OSM site can
# only go live if it's confidently a real heritage site on its own. These
# specific tag types are essentially never mistagged/vandalized on OSM (a
# hill fort doesn't get randomly tagged as one) and always carry a proper
# name - unlike memorial/monument/building, which pulled in a lot of vague
# or borderline entries (modern war memorials, a static aircraft display).
# Anything not in this set gets dropped entirely rather than sitting in
# pending_review with nobody to review it.
CONFIDENT_HISTORIC_TYPES = {"fort", "castle", "ruins", "city_gate", "archaeological_site"}

# Generic heritage-type words ("Wada", "Temple"...) are common enough across
# distinct Pune sites that comparing raw names scores two different buildings
# as similar just because they share a suffix (e.g. "Shaniwar Wada" vs "Nana
# Wada"). Stripping them before comparing isolates the actual distinguishing
# part of the name.
GENERIC_NAME_WORDS = {
    "temple", "mandir", "wada", "complex", "and", "ghat", "ghats", "dam",
    "dharan", "church", "dargah", "hall", "house", "institute", "college",
    "the", "wadi",
}

THEME_KEYWORDS: dict[str, list[str]] = {
    "Religious Heritage": ["temple", "mandir", "church", "dargah", "synagogue", "masjid"],
    "Peshwa-era Wada": ["wada"],
    "Colonial Architecture": [
        "college", "hospital", "bungalow", "institute", "post", "railway", "court",
    ],
    "Water Heritage": ["ghat", "dam", "dharan", "aquaduct", "well"],
}


@dataclass
class NormalizedSite:
    name: str
    category: str
    latitude: float
    longitude: float
    address: str | None = None
    construction_period: str | None = None
    historical_significance: str | None = None
    description: str | None = None
    image_url: str | None = None
    region_name: str | None = None
    theme_names: list[str] = field(default_factory=list)
    status: str = "approved"


def normalize_name(name: str) -> str:
    lowered = re.sub(r"[^a-z0-9 ]", "", name.lower())
    return re.sub(r"\s+", " ", lowered).strip()


def core_name(name: str) -> str:
    tokens = normalize_name(name).split()
    core = [token for token in tokens if token not in GENERIC_NAME_WORDS]
    return " ".join(core) if core else normalize_name(name)


def name_similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, core_name(a), core_name(b)).ratio()


def haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371000.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * radius * math.asin(math.sqrt(a))


KNOWN_AREAS = [
    "Camp", "Deccan Gymkhana", "Shivajinagar", "Yerawada", "Koregaon Park",
    "Kalyani Nagar", "Erandwane", "Aundh", "Wanowrie", "Hadapsar",
]


def guess_region_name(address: str | None) -> str | None:
    if not address:
        return None
    peth_match = re.search(r"([A-Za-z]+ Peth)", address)
    if peth_match:
        return peth_match.group(1)
    lowered = address.lower()
    return next((area for area in KNOWN_AREAS if area.lower() in lowered), None)


def guess_themes(name: str) -> list[str]:
    lowered = name.lower()
    return [
        theme
        for theme, keywords in THEME_KEYWORDS.items()
        if any(keyword in lowered for keyword in keywords)
    ]


def to_normalized(raw: RawSite, status: str = "approved") -> NormalizedSite:
    return NormalizedSite(
        name=raw.name,
        category="built",
        latitude=raw.latitude,
        longitude=raw.longitude,
        address=raw.address,
        description=raw.description,
        image_url=raw.image_url,
        region_name=guess_region_name(raw.address),
        theme_names=guess_themes(raw.name),
        status=status,
    )


def merge_osm_into_pmc(
    pmc_sites: list[NormalizedSite], osm_sites: list[RawSite]
) -> list[NormalizedSite]:
    merged = list(pmc_sites)
    for osm in osm_sites:
        match = _find_match(merged, osm)
        if match is None:
            if osm.historic_type in CONFIDENT_HISTORIC_TYPES:
                merged.append(to_normalized(osm, status="approved"))
            # else: not a type OSM is reliable enough about to auto-publish,
            # and there's no reviewer to hand it to - drop it.
            continue
        if not match.image_url and osm.image_url:
            idx = merged.index(match)
            merged[idx] = replace(match, image_url=osm.image_url)
    return merged


def _find_match(sites: list[NormalizedSite], osm: RawSite) -> NormalizedSite | None:
    max_distance = (
        WIDE_MATCH_DISTANCE_METERS
        if osm.historic_type in LARGE_FOOTPRINT_HISTORIC_TYPES
        else MATCH_DISTANCE_METERS
    )
    best: NormalizedSite | None = None
    best_score = 0.0
    for site in sites:
        distance = haversine_meters(site.latitude, site.longitude, osm.latitude, osm.longitude)
        if distance > max_distance:
            continue
        score = name_similarity(site.name, osm.name)
        if score >= MATCH_NAME_SIMILARITY and score > best_score:
            best, best_score = site, score
    return best


def apply_intach_enrichment(
    sites: list[NormalizedSite], intach_pages: dict[str, str]
) -> list[NormalizedSite]:
    corpus = " ".join(intach_pages.values())
    enriched = []
    for site in sites:
        if site.historical_significance:
            enriched.append(site)
            continue
        snippet = _find_mention(corpus, site.name)
        enriched.append(replace(site, historical_significance=snippet) if snippet else site)
    return enriched


def _find_mention(corpus: str, name: str, window: int = 240) -> str | None:
    idx = corpus.lower().find(name.lower())
    if idx == -1:
        return None
    start = max(0, idx - window // 2)
    end = min(len(corpus), idx + len(name) + window // 2)
    return corpus[start:end].strip()


def pipeline(
    pmc_raw: list[RawSite], osm_raw: list[RawSite], intach_pages: dict[str, str]
) -> list[NormalizedSite]:
    pmc_sites = [to_normalized(raw) for raw in pmc_raw]
    merged = merge_osm_into_pmc(pmc_sites, osm_raw)
    return apply_intach_enrichment(merged, intach_pages)


def resolve_region_id(conn: connection, name: str | None) -> str | None:
    if not name:
        return None
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO regions (id, name)
            VALUES (%s, %s)
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
            """,
            (str(uuid4()), name),
        )
        return cur.fetchone()[0]


def resolve_theme_ids(conn: connection, names: list[str]) -> list[str]:
    ids = []
    with conn.cursor() as cur:
        for name in names:
            cur.execute(
                """
                INSERT INTO themes (id, name)
                VALUES (%s, %s)
                ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                RETURNING id
                """,
                (str(uuid4()), name),
            )
            ids.append(cur.fetchone()[0])
    return ids


def _find_existing_site_id(conn: connection, site: NormalizedSite) -> str | None:
    # Same name alone isn't a reliable key - Pune has many distinct buildings
    # that legitimately share a common name (e.g. several unrelated "Ram
    # Mandir"s), so an existing row only counts as "the same site" if it's
    # also physically close to this one.
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT id, ST_Y(location::geometry) AS latitude, ST_X(location::geometry) AS longitude
            FROM heritage_sites
            WHERE name = %s
            """,
            (site.name,),
        )
        candidates = cur.fetchall()

    for candidate in candidates:
        if candidate["latitude"] is None or candidate["longitude"] is None:
            continue
        distance = haversine_meters(
            site.latitude, site.longitude, candidate["latitude"], candidate["longitude"]
        )
        if distance <= MATCH_DISTANCE_METERS:
            return candidate["id"]
    return None


def upsert_site(conn: connection, site: NormalizedSite) -> str:
    region_id = resolve_region_id(conn, site.region_name)
    theme_ids = resolve_theme_ids(conn, site.theme_names)
    location_expr = "ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography"

    with conn.cursor() as cur:
        site_id = _find_existing_site_id(conn, site)

        if site_id:
            cur.execute(
                f"""
                UPDATE heritage_sites
                SET category = %s, location = {location_expr}, address = %s,
                    construction_period = %s, historical_significance = %s,
                    description = %s, image_url = COALESCE(image_url, %s),
                    region_id = %s, updated_at = now()
                WHERE id = %s
                """,
                (
                    site.category, site.longitude, site.latitude, site.address,
                    site.construction_period, site.historical_significance,
                    site.description, site.image_url, region_id, site_id,
                ),
            )
        else:
            site_id = str(uuid4())
            cur.execute(
                f"""
                INSERT INTO heritage_sites (
                    id, name, category, location, address, construction_period,
                    historical_significance, description, image_url, status,
                    region_id, created_at, updated_at
                )
                VALUES (%s, %s, %s, {location_expr}, %s, %s, %s, %s, %s, %s, %s, now(), now())
                """,
                (
                    site_id, site.name, site.category, site.longitude, site.latitude,
                    site.address, site.construction_period, site.historical_significance,
                    site.description, site.image_url, site.status, region_id,
                ),
            )

        cur.execute("DELETE FROM heritage_site_themes WHERE site_id = %s", (site_id,))
        for theme_id in theme_ids:
            cur.execute(
                """
                INSERT INTO heritage_site_themes (site_id, theme_id)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
                """,
                (site_id, theme_id),
            )

    return site_id


def load(conn: connection, sites: list[NormalizedSite]) -> dict[str, int]:
    summary = {"total": len(sites), "loaded": 0, "failed": 0}
    for site in sites:
        with conn.cursor() as cur:
            cur.execute("SAVEPOINT site_upsert")
        try:
            upsert_site(conn, site)
            with conn.cursor() as cur:
                cur.execute("RELEASE SAVEPOINT site_upsert")
            summary["loaded"] += 1
        except Exception:
            logger.exception("Failed to load site %r", site.name)
            with conn.cursor() as cur:
                cur.execute("ROLLBACK TO SAVEPOINT site_upsert")
            summary["failed"] += 1
    return summary


def main() -> None:
    import json

    import psycopg2

    from config import settings

    logging.basicConfig(level=logging.INFO)

    pmc_raw = load_raw_sites(RAW_DIR / "pmc_wikidata.json")
    osm_raw = load_raw_sites(RAW_DIR / "osm.json")
    intach_pages: dict[str, str] = {}
    intach_path = RAW_DIR / "intach_pages.json"
    if intach_path.exists():
        intach_pages = json.loads(intach_path.read_text())

    sites = pipeline(pmc_raw, osm_raw, intach_pages)

    conn = psycopg2.connect(settings.database_url)
    try:
        summary = load(conn, sites)
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    logger.info("Load complete: %s", summary)


if __name__ == "__main__":
    main()
