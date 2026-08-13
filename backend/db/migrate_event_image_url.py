"""Add an image_url column to the events table.

Run once after deploying this API:
    cd backend
    python -m db.migrate_event_image_url
"""

import psycopg2

from config import settings


STATEMENTS = """
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;
"""


def main() -> None:
    conn = psycopg2.connect(settings.database_url)
    try:
        with conn.cursor() as cur:
            cur.execute(STATEMENTS)
        conn.commit()
        print("Event image_url migration applied.")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
