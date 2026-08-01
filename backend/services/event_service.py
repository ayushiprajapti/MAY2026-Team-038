from uuid import uuid4

from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor

from fastapi import HTTPException, status

from schemas.events import CreateEventRequest, UpdateEventRequest


def list_all_events(conn: connection) -> dict:
    """Return all events plus the three dashboard summary stats.

    Stats computed:
    - upcoming_events  : published events with event_date >= today
    - total_registrations : confirmed + waitlisted rows across all events
    - completed_events : events with status = 'completed'
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # ── 1. Event rows ──────────────────────────────────────────────────
        cur.execute(
            """
            SELECT
                e.id,
                e.title,
                e.description,
                e.event_type,
                e.site_id,
                e.venue,
                e.event_date,
                e.start_time,
                e.end_time,
                e.participant_limit,
                e.registration_deadline,
                e.coordinator_id,
                e.status,
                COUNT(er.id) FILTER (
                    WHERE er.status IN ('confirmed', 'waitlisted')
                ) AS registration_count
            FROM events AS e
            LEFT JOIN event_registrations AS er ON er.event_id = e.id
            GROUP BY e.id
            ORDER BY e.event_date ASC, e.start_time ASC
            """
        )
        events = cur.fetchall()

        # ── 2. Stat card values (single query, three conditional counts) ──
        cur.execute(
            """
            SELECT
                COUNT(*) FILTER (
                    WHERE status = 'published'
                    AND event_date >= CURRENT_DATE
                ) AS upcoming_events,
                COUNT(*) FILTER (
                    WHERE status = 'completed'
                ) AS completed_events,
                COALESCE((
                    SELECT COUNT(*)
                    FROM event_registrations
                    WHERE status IN ('confirmed', 'waitlisted')
                ), 0) AS total_registrations
            FROM events
            """
        )
        stats = cur.fetchone()

    return {
        "upcoming_events": stats["upcoming_events"],
        "total_registrations": stats["total_registrations"],
        "completed_events": stats["completed_events"],
        "events": events,
    }


def create_event(conn: connection, data: CreateEventRequest, coordinator_id: str) -> dict:
    """Insert a new published event and return the created row."""
    new_id = str(uuid4())
    site_id = str(data.site_id) if data.site_id else None
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            INSERT INTO events (
                id,
                title,
                description,
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
                created_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'published', now())
            RETURNING
                id,
                title,
                description,
                event_type,
                site_id,
                venue,
                event_date,
                start_time,
                end_time,
                participant_limit,
                registration_deadline,
                coordinator_id,
                status
            """,
            (
                new_id,
                data.title,
                data.description,
                data.event_type,
                site_id,
                data.venue,
                data.event_date,
                data.start_time,
                data.end_time,
                data.participant_limit,
                data.registration_deadline,
                coordinator_id,
            ),
        )
        row = dict(cur.fetchone())
        conn.commit()

    # New event has no registrations yet
    row["registration_count"] = 0
    return row


def update_event(conn: connection, event_id: str, data: UpdateEventRequest) -> dict:
    """Partially update an existing event (PATCH semantics).

    Only the fields explicitly included in the request body are written
    to the database. Raises 404 if no event with the given id exists.
    """
    # Build SET clause from only the fields the caller actually sent
    updates = data.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Request body must contain at least one field to update.",
        )

    if "site_id" in updates and updates["site_id"] is not None:
        updates["site_id"] = str(updates["site_id"])

    set_clause = ", ".join(f"{col} = %s" for col in updates)
    values = list(updates.values()) + [event_id]

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            f"""
            UPDATE events
            SET {set_clause}
            WHERE id = %s
            RETURNING
                id,
                title,
                description,
                event_type,
                site_id,
                venue,
                event_date,
                start_time,
                end_time,
                participant_limit,
                registration_deadline,
                coordinator_id,
                status
            """,
            values,
        )
        row = cur.fetchone()
        if row is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event '{event_id}' not found.",
            )
        row = dict(row)
        conn.commit()

    # Re-fetch the live registration count for this event
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT COUNT(id) FILTER (
                WHERE status IN ('confirmed', 'waitlisted')
            ) AS registration_count
            FROM event_registrations
            WHERE event_id = %s
            """,
            (event_id,),
        )
        row["registration_count"] = cur.fetchone()["registration_count"]

    return row


def delete_event(conn: connection, event_id: str) -> None:
    """Delete an event and its registrations by id.

    Removes child rows in event_registrations first to satisfy the
    foreign-key constraint, then deletes the event row.
    Raises 404 if no event with the given id exists.
    """
    with conn.cursor() as cur:
        # Confirm the event exists before touching anything
        cur.execute("SELECT id FROM events WHERE id = %s", (event_id,))
        if cur.fetchone() is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event '{event_id}' not found.",
            )

        # Delete child rows first (event_registrations.event_id → events.id FK)
        cur.execute(
            "DELETE FROM event_registrations WHERE event_id = %s",
            (event_id,),
        )

        # Now delete the event itself
        cur.execute("DELETE FROM events WHERE id = %s", (event_id,))

        conn.commit()


def list_event_registrants(conn: connection, event_id: str) -> dict:
    """Return the event header and its confirmed/waitlisted attendees.

    Raises 404 if no event with the given id exists.
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # ── 1. Fetch the event header ─────────────────────────────────────
        cur.execute(
            """
            SELECT id, title, event_date, start_time, end_time, venue
            FROM events
            WHERE id = %s
            """,
            (event_id,),
        )
        event = cur.fetchone()
        if event is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event '{event_id}' not found.",
            )

        # ── 2. Fetch registrants joined with user profile ─────────────────
        cur.execute(
            """
            SELECT
                er.id              AS registration_id,
                er.user_id,
                er.status          AS registration_status,
                er.registered_at,
                u.full_name,
                u.email,
                u.phone
            FROM event_registrations AS er
            JOIN users AS u ON u.id = er.user_id
            WHERE er.event_id = %s
              AND er.status IN ('confirmed', 'waitlisted')
            ORDER BY er.registered_at ASC
            """,
            (event_id,),
        )
        registrants = cur.fetchall()

    return {
        "event_id": event["id"],
        "title": event["title"],
        "event_date": event["event_date"],
        "start_time": event["start_time"],
        "end_time": event["end_time"],
        "venue": event["venue"],
        "total_registrations": len(registrants),
        "registrants": registrants,
    }
