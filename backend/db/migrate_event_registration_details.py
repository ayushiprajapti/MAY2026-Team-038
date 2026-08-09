"""Add public event-registration form fields to an existing database.

Run once after deploying this API:
    cd backend
    python -m db.migrate_event_registration_details
"""

import psycopg2

from config import settings


STATEMENTS = """
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS attendee_count INT NOT NULL DEFAULT 1;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS receive_event_updates BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE event_registrations DROP CONSTRAINT IF EXISTS chk_event_registration_attendee_count;
ALTER TABLE event_registrations ADD CONSTRAINT chk_event_registration_attendee_count CHECK (attendee_count > 0);
"""


def main() -> None:
    conn = psycopg2.connect(settings.database_url)
    try:
        with conn.cursor() as cur:
            cur.execute(STATEMENTS)
        conn.commit()
        print("Event registration details migration applied.")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
