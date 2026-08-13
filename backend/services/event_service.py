from datetime import date, datetime, timezone
from uuid import uuid4

from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor

from fastapi import HTTPException, status

from schemas.events import (
    CreateEventRequest,
    EventRegistrationRequest,
    UpdateEventRequest,
)
from utils.cache import cached


@cached(ttl_seconds=60)
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
                e.image_url,
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
                image_url,
                created_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'published', %s, now())
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
                status,
                image_url
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
                data.image_url,
            ),
        )
        row = dict(cur.fetchone())
        conn.commit()

    # New event has no registrations yet
    row["registration_count"] = 0
    list_all_events.cache_clear()
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
                status,
                image_url
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

    list_all_events.cache_clear()
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

    list_all_events.cache_clear()


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


@cached(ttl_seconds=60)
def list_upcoming_events(
    conn: connection,
    event_type: str | None = None,
) -> dict:
    """Return all published events whose date is today or in the future.

    Includes a computed ``seats_left`` field (participant_limit minus the
    number of confirmed + waitlisted registrations).  An optional
    ``event_type`` filter narrows results to a single category — matching
    the 'All events' dropdown in the UI.

    Results are ordered chronologically (date → start_time).
    No authentication is required.
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        query = """
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
                e.status,
                e.image_url,
                GREATEST(
                    e.participant_limit - COALESCE(
                        SUM(er.attendee_count) FILTER (WHERE er.status = 'confirmed'),
                        0
                    ),
                    0
                ) AS seats_left
            FROM events AS e
            LEFT JOIN event_registrations AS er ON er.event_id = e.id
            WHERE e.status = 'published'
              AND e.event_date >= CURRENT_DATE
              {type_filter}
            GROUP BY e.id
            ORDER BY e.event_date ASC, e.start_time ASC
        """
        if event_type:
            cur.execute(
                query.format(type_filter="AND e.event_type = %s"),
                (event_type,),
            )
        else:
            cur.execute(query.format(type_filter=""))

        events = cur.fetchall()

    return {"events": events}


def register_for_event(
    conn: connection,
    event_id: str,
    user_id: str,
    data: EventRegistrationRequest,
) -> dict:
    """Register a user for a published upcoming event.

    A row lock on the event prevents two simultaneous requests from both
    claiming the final seat. Registrations beyond capacity are waitlisted.
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT id, event_date, registration_deadline, participant_limit, status
            FROM events
            WHERE id = %s
            FOR UPDATE
            """,
            (event_id,),
        )
        event = cur.fetchone()
        if event is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event '{event_id}' not found.",
            )

        event_date = event["event_date"]
        if isinstance(event_date, str):
            event_date = date.fromisoformat(event_date)
        if event["status"] != "published" or event_date < date.today():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Registration is not available for this event.",
            )

        deadline = event["registration_deadline"]
        if isinstance(deadline, str):
            deadline = datetime.fromisoformat(deadline.replace("Z", "+00:00"))
        if deadline is not None:
            if deadline.tzinfo is None:
                deadline = deadline.replace(tzinfo=timezone.utc)
            if deadline <= datetime.now(timezone.utc):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="The registration deadline for this event has passed.",
                )

        cur.execute(
            """
            SELECT id
            FROM event_registrations
            WHERE event_id = %s AND user_id = %s
            """,
            (event_id, user_id),
        )
        if cur.fetchone() is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You are already registered for this event.",
            )

        cur.execute(
            """
            SELECT COALESCE(SUM(attendee_count), 0) AS attendee_count
            FROM event_registrations
            WHERE event_id = %s
              AND status = 'confirmed'
            """,
            (event_id,),
        )
        confirmed_attendees = cur.fetchone()["attendee_count"]
        registration_status = (
            "confirmed"
            if confirmed_attendees + data.attendee_count <= event["participant_limit"]
            else "waitlisted"
        )

        registration_id = str(uuid4())
        cur.execute(
            """
            INSERT INTO event_registrations (
                id, event_id, user_id, status, first_name, last_name, email, phone,
                attendee_count, note, receive_event_updates, registered_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, now())
            RETURNING id AS registration_id, event_id, user_id,
                      status AS registration_status, registered_at, attendee_count
            """,
            (
                registration_id,
                event_id,
                user_id,
                registration_status,
                data.first_name.strip(),
                data.last_name.strip(),
                str(data.email),
                data.phone.strip(),
                data.attendee_count,
                data.note.strip() if data.note else None,
                data.receive_event_updates,
            ),
        )
        registration = dict(cur.fetchone())
        conn.commit()

    # Keep the admin event dashboard's registration totals current.
    list_all_events.cache_clear()
    list_upcoming_events.cache_clear()
    return registration


def revoke_event_registration(conn: connection, event_id: str, user_id: str) -> None:
    """Cancel a user's active registration and promote the next waitlisted user.

    The registration row is retained with a ``cancelled`` status so it remains
    visible in the user's event history. Locking the event serializes this with
    new registrations and avoids a capacity race during waitlist promotion.
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            "SELECT id FROM events WHERE id = %s FOR UPDATE",
            (event_id,),
        )
        if cur.fetchone() is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event '{event_id}' not found.",
            )

        cur.execute(
            """
            SELECT id, status
            FROM event_registrations
            WHERE event_id = %s
              AND user_id = %s
              AND status IN ('confirmed', 'waitlisted')
            """,
            (event_id, user_id),
        )
        registration = cur.fetchone()
        if registration is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="You do not have an active registration for this event.",
            )

        cur.execute(
            "UPDATE event_registrations SET status = 'cancelled' WHERE id = %s",
            (registration["id"],),
        )

        # A waitlisted cancellation frees no confirmed seat. A confirmed
        # cancellation promotes the earliest waitlisted user, if any.
        if registration["status"] == "confirmed":
            cur.execute(
                """
                SELECT id
                FROM event_registrations
                WHERE event_id = %s AND status = 'waitlisted'
                ORDER BY registered_at ASC
                LIMIT 1
                FOR UPDATE
                """,
                (event_id,),
            )
            waitlisted_registration = cur.fetchone()
            if waitlisted_registration is not None:
                cur.execute(
                    "UPDATE event_registrations SET status = 'confirmed' WHERE id = %s",
                    (waitlisted_registration["id"],),
                )

        conn.commit()

    list_all_events.cache_clear()
    list_upcoming_events.cache_clear()


def list_user_event_history(conn: connection, user_id: str) -> list[dict]:
    """Return the authenticated user's full registration history.

    Each row contains the registration metadata (id, status, registered_at)
    joined with the event details (title, type, date, venue, status) so the
    frontend can render the 'Your event history' cards without a second call.

    Ordered by event_date DESC so the most recent events appear first.
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT
                er.id               AS registration_id,
                er.status           AS registration_status,
                CASE
                    WHEN er.status = 'cancelled' THEN 'revoked'
                    WHEN e.status = 'completed' AND er.status = 'confirmed' THEN 'attended'
                    WHEN er.status = 'waitlisted' THEN 'waitlisted'
                    ELSE 'registered'
                END                 AS history_status,
                er.registered_at,
                er.attendee_count,
                er.first_name,
                er.last_name,
                e.id                AS event_id,
                e.title,
                e.description,
                e.event_type,
                e.venue,
                e.event_date,
                e.start_time,
                e.end_time,
                e.status            AS event_status,
                e.image_url
            FROM event_registrations AS er
            JOIN events AS e ON e.id = er.event_id
            WHERE er.user_id = %s
            ORDER BY e.event_date DESC, e.start_time DESC
            """,
            (user_id,),
        )
        return cur.fetchall()
