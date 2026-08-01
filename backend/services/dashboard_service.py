from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor


def get_shop_stats(conn: connection) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT
                COUNT(*) AS total_orders,
                COALESCE(
                    SUM(total_cents) FILTER (WHERE status != 'cancelled'),
                    0
                ) AS total_revenue_cents,
                COUNT(*) FILTER (WHERE status = 'pending') AS pending_orders,
                COUNT(*) FILTER (WHERE status = 'delivered') AS delivered_orders
            FROM orders
            """
        )

        stats = cur.fetchone()

    return stats


def get_dashboard_events(conn: connection) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT
                id,
                title,
                venue,
                event_date,
                status
            FROM events
            WHERE event_date = CURRENT_DATE
            ORDER BY start_time
            """
        )

        today = cur.fetchall()

        cur.execute(
            """
            SELECT
                id,
                title,
                venue,
                event_date,
                status
            FROM events
            WHERE event_date > CURRENT_DATE
            ORDER BY event_date
            LIMIT 5
            """
        )

        upcoming = cur.fetchall()

    return {
        "today": today,
        "upcoming": upcoming,
    }


def get_recent_volunteer_uploads(conn: connection) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT
                hs.id,
                hs.name,
                hs.status,
                hs.image_url,
                hs.created_at,
                u.full_name AS submitted_by
            FROM heritage_sites hs
            LEFT JOIN users u
                ON hs.submitted_by = u.id
            ORDER BY hs.created_at DESC
            LIMIT 5
            """
        )

        uploads = cur.fetchall()

    return {
        "uploads": uploads,
    }