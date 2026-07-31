from fastapi import HTTPException, status
from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor


def list_events(conn: connection) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT
                e.id,
                e.title,
                e.description,
                e.event_type,
                hs.name AS heritage_site,
                e.venue,
                e.event_date,
                e.start_time,
                e.end_time,
                e.participant_limit,
                e.registration_deadline,
                u.full_name AS coordinator_name,
                e.status,
                COUNT(er.id) AS registrations
            FROM events e
            LEFT JOIN heritage_sites hs
                ON e.site_id = hs.id
            LEFT JOIN users u
                ON e.coordinator_id = u.id
            LEFT JOIN event_registrations er
                ON er.event_id = e.id
            GROUP BY
                e.id,
                hs.name,
                u.full_name
            ORDER BY e.event_date DESC, e.start_time DESC
            """
        )

        events = cur.fetchall()

    return {
        "events": events
    }


def get_event(conn: connection, event_id: str) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT
                e.id,
                e.title,
                e.description,
                e.event_type,
                e.site_id,
                hs.name AS heritage_site,
                e.venue,
                e.event_date,
                e.start_time,
                e.end_time,
                e.participant_limit,
                e.registration_deadline,
                e.coordinator_id,
                u.full_name AS coordinator_name,
                e.status,
                e.created_at
            FROM events e
            LEFT JOIN heritage_sites hs
                ON e.site_id = hs.id
            LEFT JOIN users u
                ON e.coordinator_id = u.id
            WHERE e.id = %s::uuid
            """,
            (event_id,),
        )

        event = cur.fetchone()

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    return event


def create_event(conn: connection, data: dict) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            INSERT INTO events (
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
            )
            VALUES (
                %(title)s,
                %(description)s,
                %(event_type)s,
                %(site_id)s::uuid,
                %(venue)s,
                %(event_date)s,
                %(start_time)s,
                %(end_time)s,
                %(participant_limit)s,
                %(registration_deadline)s,
                %(coordinator_id)s::uuid,
                %(status)s
            )
            RETURNING id
            """,
            data,
        )

        event = cur.fetchone()

    return {
        "message": "Event created successfully",
        "id": str(event["id"])
    }


def update_event(conn: connection, event_id: str, data: dict) -> dict:
    fields = []
    values = {}

    for key, value in data.items():
        if value is not None:
            if key in ("site_id", "coordinator_id"):
                fields.append(f"{key} = %({key})s::uuid")
            else:
                fields.append(f"{key} = %({key})s")
            values[key] = value

    if not fields:
        return {
            "message": "Nothing to update"
        }

    values["event_id"] = event_id

    query = f"""
        UPDATE events
        SET {', '.join(fields)}
        WHERE id = %(event_id)s::uuid
        RETURNING id
    """

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(query, values)
        updated = cur.fetchone()

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    return {
        "message": "Event updated successfully"
    }


def delete_event(conn: connection, event_id: str) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            DELETE FROM events
            WHERE id = %s::uuid
            RETURNING id
            """,
            (event_id,),
        )

        deleted = cur.fetchone()

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    return {
        "message": "Event deleted successfully"
    }