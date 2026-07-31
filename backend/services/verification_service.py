from fastapi import HTTPException, status
from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor


def list_submissions(conn: connection) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT
                hs.id,
                hs.name,
                hs.category,
                hs.status,
                hs.image_url,
                u.full_name AS submitted_by,
                hs.created_at
            FROM heritage_sites hs
            JOIN users u
                ON hs.submitted_by = u.id
            ORDER BY hs.created_at DESC
            """
        )

        submissions = cur.fetchall()

    return {
        "submissions": submissions
    }


def get_submission(conn: connection, submission_id: str) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT
                hs.id,
                hs.name,
                hs.category,
                hs.address,
                hs.construction_period,
                hs.historical_significance,
                hs.description,
                hs.image_url,
                hs.status,
                hs.review_notes,
                hs.created_at,
                u.full_name AS submitted_by
            FROM heritage_sites hs
            JOIN users u
                ON hs.submitted_by = u.id
            WHERE hs.id = %s
            """,
            (submission_id,),
        )

        submission = cur.fetchone()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )

    return submission


def approve_submission(
    conn: connection,
    submission_id: str,
    admin_id: str,
    review_notes: str | None,
) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            UPDATE heritage_sites
            SET
                status = 'approved',
                reviewed_by = %s,
                reviewed_at = NOW(),
                review_notes = %s
            WHERE id = %s
            RETURNING id
            """,
            (
                admin_id,
                review_notes,
                submission_id,
            ),
        )

        updated = cur.fetchone()

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )

    return {
        "message": "Submission approved successfully"
    }


def reject_submission(
    conn: connection,
    submission_id: str,
    admin_id: str,
    review_notes: str | None,
) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            UPDATE heritage_sites
            SET
                status = 'rejected',
                reviewed_by = %s,
                reviewed_at = NOW(),
                review_notes = %s
            WHERE id = %s
            RETURNING id
            """,
            (
                admin_id,
                review_notes,
                submission_id,
            ),
        )

        updated = cur.fetchone()

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )

    return {
        "message": "Submission rejected successfully"
    }