from uuid import UUID

import psycopg2
from fastapi import HTTPException, status
from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor

SELECT_COLUMNS = """
    id, name, category, address, construction_period, historical_significance,
    description, image_url, status, submitted_by, reviewed_by, reviewed_at,
    review_notes, region_id, created_at, updated_at,
    ST_Y(location::geometry) AS latitude,
    ST_X(location::geometry) AS longitude
"""


def get_pending_submissions(conn: connection, status_filter: str | None = "pending_review"):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        if status_filter:
            cur.execute(f"""
                SELECT {SELECT_COLUMNS}
                FROM heritage_sites
                WHERE status = %s
                ORDER BY created_at DESC;
            """, (status_filter,))
        else:
            cur.execute(f"""
                SELECT {SELECT_COLUMNS}
                FROM heritage_sites
                ORDER BY created_at DESC;
            """)

        return cur.fetchall()


def get_submission_by_id(conn: connection, submission_id: UUID):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(f"""
            SELECT {SELECT_COLUMNS}
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
        cur.execute(f"""
            UPDATE heritage_sites
            SET
                status='approved',
                reviewed_by=%s,
                reviewed_at=NOW(),
                review_notes=%s,
                updated_at=NOW()
            WHERE id=%s
            RETURNING {SELECT_COLUMNS};
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
        cur.execute(f"""
            UPDATE heritage_sites
            SET
                status='rejected',
                reviewed_by=%s,
                reviewed_at=NOW(),
                review_notes=%s,
                updated_at=NOW()
            WHERE id=%s
            RETURNING {SELECT_COLUMNS};
        """, (
            str(reviewed_by),
            review_notes,
            str(submission_id),
        ))

        return cur.fetchone()


def delete_submission(conn: connection, submission_id: UUID):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        try:
            cur.execute("""
                DELETE FROM heritage_sites
                WHERE id=%s
                RETURNING id;
            """, (str(submission_id),))
        except psycopg2.errors.ForeignKeyViolation:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Cannot delete this heritage site because other records "
                    "(themes, events, trails, etc.) still reference it."
                ),
            )

        return cur.fetchone()
