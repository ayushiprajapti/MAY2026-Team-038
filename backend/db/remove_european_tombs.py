"""One-off cleanup: 'European Tombs' has bad source data (latitude ==
longitude - a scrape bug) and gets deleted from both the live DB and the
raw source JSON so a future loader re-run doesn't reintroduce it.

Run from backend/: python -m db.remove_european_tombs
"""

import json

import psycopg2.errors
from psycopg2.extras import RealDictCursor

from database import pool

SOURCE_JSON_PATH = "data_sourcing/heritage/raw/pmc_wikidata.json"
TARGET_NAME = "European Tombs"


def remove_from_source_json(path: str) -> bool:
    with open(path) as f:
        entries = json.load(f)

    filtered = [e for e in entries if e.get("name") != TARGET_NAME]
    removed = len(filtered) != len(entries)

    if removed:
        with open(path, "w") as f:
            json.dump(filtered, f, indent=2)

    return removed


def main() -> None:
    conn = pool.getconn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # heritage_site_embeddings (RAG chatbot data) FK-references the
            # site and has no ON DELETE CASCADE, so it must go first.
            cur.execute(
                "DELETE FROM heritage_site_embeddings WHERE site_id IN "
                "(SELECT id FROM heritage_sites WHERE name = %s);",
                (TARGET_NAME,),
            )

            try:
                cur.execute(
                    "DELETE FROM heritage_sites WHERE name = %s RETURNING id;",
                    (TARGET_NAME,),
                )
            except psycopg2.errors.ForeignKeyViolation:
                conn.rollback()
                print(
                    f"Could not delete {TARGET_NAME!r}: still referenced by "
                    "other records (themes, events, trails, etc.)."
                )
                return

            deleted = cur.fetchall()
        conn.commit()
        print(f"Deleted {len(deleted)} row(s) named {TARGET_NAME!r} from heritage_sites.")
    finally:
        pool.putconn(conn)

    if remove_from_source_json(SOURCE_JSON_PATH):
        print(f"Removed {TARGET_NAME!r} from {SOURCE_JSON_PATH}.")
    else:
        print(f"{TARGET_NAME!r} not found in {SOURCE_JSON_PATH} (already removed?).")


if __name__ == "__main__":
    main()
