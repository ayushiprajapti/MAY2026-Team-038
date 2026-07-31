from uuid import UUID

from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor


def get_pending_submissions(conn: connection):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT *
            FROM heritage_sites
            WHERE status = 'pending_review'
            ORDER BY created_at DESC;
        """)

        return cur.fetchall()


def get_submission_by_id(conn: connection, submission_id: UUID):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT *
            FROM heritage_sites
            WHERE id = %s;
        """, (str(submission_id),))

        return cur.fetchone()


def approve_submission(
    conn: connection,
    submission_id: UUID,
    reviewed_by: UUID,
    review_notes: str | None,
):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            UPDATE heritage_sites
            SET
                status='approved',
                reviewed_by=%s,
                reviewed_at=NOW(),
                review_notes=%s,
                updated_at=NOW()
            WHERE id=%s
            RETURNING *;
        """, (
            str(reviewed_by),
            review_notes,
            str(submission_id),
        ))

        return cur.fetchone()


def reject_submission(
    conn: connection,
    submission_id: UUID,
    reviewed_by: UUID,
    review_notes: str | None,
):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            UPDATE heritage_sites
            SET
                status='rejected',
                reviewed_by=%s,
                reviewed_at=NOW(),
                review_notes=%s,
                updated_at=NOW()
            WHERE id=%s
            RETURNING *;
        """, (
            str(reviewed_by),
            review_notes,
            str(submission_id),
        ))

        return cur.fetchone()


def delete_submission(conn: connection, submission_id: UUID):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            DELETE FROM heritage_sites
            WHERE id=%s
            RETURNING *;
        """, (str(submission_id),))

        return cur.fetchone()