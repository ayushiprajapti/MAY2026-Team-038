from __future__ import annotations

import logging
from typing import Callable, TypeVar

import psycopg2

from config import settings
from data_sourcing import intach_enrichment, loader, osm_overpass, pmc_wikidata
from data_sourcing.models import RAW_DIR, dump_raw_sites

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
    logger.info("Fetching PMC/Wikidata heritage list...")
    pmc_raw = _safe_fetch("PMC/Wikidata", pmc_wikidata.fetch, [])
    dump_raw_sites(pmc_raw, RAW_DIR / "pmc_wikidata.json")
    logger.info("Fetched %d PMC/Wikidata sites", len(pmc_raw))

    logger.info("Fetching OSM heritage-tagged points...")
    osm_raw = _safe_fetch("OSM", osm_overpass.fetch, [])
    dump_raw_sites(osm_raw, RAW_DIR / "osm.json")
    logger.info("Fetched %d OSM sites", len(osm_raw))

    logger.info("Fetching INTACH Pune enrichment pages...")
    intach_pages = _safe_fetch("INTACH pages", intach_enrichment.fetch_intach_pages, {})
    logger.info("Fetched %d INTACH pages", len(intach_pages))

    sites = loader.pipeline(pmc_raw, osm_raw, intach_pages)

    conn = psycopg2.connect(settings.database_url)
    try:
        summary = loader.load(conn, sites)
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    logger.info("Load complete: %s", summary)


if __name__ == "__main__":
    main()
