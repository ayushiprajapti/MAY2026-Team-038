"""One-off seed script: inserts dummy `events` rows - a mix of past
(completed) and upcoming (published) events - so the Event Management
dashboard has real data to show.

Idempotent - re-running skips seeding if dummy rows already exist.

All seeded rows are tagged with venue containing 'DUMMY SEED DATA' so
they're easy to find and remove later:

    DELETE FROM events WHERE venue LIKE '%DUMMY SEED DATA%';

Run from backend/: python -m db.seed_dummy_events
"""

import random
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from psycopg2.extras import RealDictCursor

from database import pool

MARKER = "DUMMY SEED DATA"
PAST_EVENT_COUNT = 8
UPCOMING_EVENT_COUNT = 13
UPCOMING_SPAN_DAYS = 80

EVENT_TYPES = ["heritage_walk", "workshop", "quiz", "competition", "cultural_event"]

TITLES_BY_TYPE = {
    "heritage_walk": [
        "Old Pune Heritage Walk",
        "Peth Areas Walking Trail",
        "Riverside Heritage Walk",
        "Wada Architecture Walk",
    ],
    "workshop": [
        "Traditional Craft Workshop",
        "Heritage Photography Workshop",
        "Stone Carving Workshop",
        "Archival Documentation Workshop",
    ],
    "quiz": [
        "Pune Heritage Quiz Night",
        "Monuments & History Quiz",
        "Culture Trivia Challenge",
    ],
    "competition": [
        "Heritage Sketching Competition",
        "Photo Walk Competition",
        "Young Historians Essay Contest",
    ],
    "cultural_event": [
        "Traditional Music Evening",
        "Folk Dance Festival",
        "Heritage Food Festival",
    ],
}

VENUES = [
    "Shaniwar Wada Grounds",
    "Pune University Heritage Hall",
    "Community Center, Deccan",
    "Tribal Museum Auditorium",
    "Sarasbaug Open Grounds",
    "Kelkar Museum Courtyard",
]


def main() -> None:
    conn = pool.getconn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT count(*) AS n FROM events WHERE venue LIKE %s", (f"%{MARKER}%",))
            if cur.fetchone()["n"] > 0:
                print("Dummy event data already present - skipping seed.")
                return

            cur.execute("SELECT id FROM heritage_sites WHERE status = 'approved'")
            site_ids = [row["id"] for row in cur.fetchall()]

            cur.execute(
                """
                SELECT u.id FROM users u
                JOIN user_roles ur ON ur.user_id = u.id
                WHERE ur.role = 'event_coordinator'
                """
            )
            coordinator_ids = [row["id"] for row in cur.fetchall()]
            if not coordinator_ids:
                cur.execute("SELECT id FROM users LIMIT 5")
                coordinator_ids = [row["id"] for row in cur.fetchall()]
            if not coordinator_ids:
                print("No users found - cannot seed events without a coordinator_id. Aborting.")
                return

            now = datetime.now(timezone.utc)
            today = now.date()
            inserted = 0

            def insert_event(event_date, status: str) -> None:
                nonlocal inserted
                event_type = random.choice(EVENT_TYPES)
                title = random.choice(TITLES_BY_TYPE[event_type])
                venue = f"{random.choice(VENUES)} ({MARKER})"
                start_hour = random.randint(9, 16)
                start_time = f"{start_hour:02d}:00:00"
                end_time = f"{start_hour + random.randint(1, 3):02d}:00:00"
                participant_limit = random.choice([20, 30, 50, 75, 100])
                registration_deadline = datetime.combine(
                    event_date, datetime.min.time(), tzinfo=timezone.utc
                ) - timedelta(days=random.randint(1, 5))
                site_id = random.choice(site_ids) if site_ids and random.random() < 0.7 else None
                coordinator_id = random.choice(coordinator_ids)

                cur.execute(
                    """
                    INSERT INTO events (
                        id, title, description, event_type, site_id, venue,
                        event_date, start_time, end_time, participant_limit,
                        registration_deadline, coordinator_id, status, created_at
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        str(uuid4()),
                        title,
                        f"{title} - a heritage {event_type.replace('_', ' ')} organised by INTACH Pune.",
                        event_type,
                        site_id,
                        venue,
                        event_date,
                        start_time,
                        end_time,
                        participant_limit,
                        registration_deadline,
                        coordinator_id,
                        status,
                        now,
                    ),
                )
                inserted += 1

            # Past events, spread over the last ~4 months, mostly completed
            for i in range(PAST_EVENT_COUNT):
                days_ago = random.randint(5, 120)
                event_date = today - timedelta(days=days_ago)
                status = random.choices(["completed", "cancelled"], weights=[9, 1])[0]
                insert_event(event_date, status)

            # Upcoming events, spread over the next ~2-3 months, published
            for i in range(UPCOMING_EVENT_COUNT):
                days_ahead = random.randint(1, UPCOMING_SPAN_DAYS)
                event_date = today + timedelta(days=days_ahead)
                insert_event(event_date, "published")

        conn.commit()
        print(f"Seeded {inserted} dummy events "
              f"({PAST_EVENT_COUNT} past, {UPCOMING_EVENT_COUNT} upcoming).")
    except Exception:
        conn.rollback()
        raise
    finally:
        pool.putconn(conn)


if __name__ == "__main__":
    main()
