from uuid import UUID

from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor

from schemas.volunteer_heritage import CreateHeritageSubmissionRequest


SELECT_COLUMNS = """
    id,
    name,
    category,
    address,
    construction_period,
    historical_significance,
    description,
    image_url,
    status,
    submitted_by,
    reviewed_at,
    review_notes,
    created_at,
    updated_at,
    ST_Y(location::geometry) AS latitude,
    ST_X(location::geometry) AS longitude
"""


def create_submission(
    conn: connection,
    user_id: UUID,
    payload: CreateHeritageSubmissionRequest,
):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            f"""
            INSERT INTO heritage_sites (
                name,
                category,
                location,
                address,
                construction_period,
                historical_significance,
                description,
                image_url,
                status,
                submitted_by
            )
            VALUES (
                %s,
                %s,
                CASE
                    WHEN %s IS NOT NULL AND %s IS NOT NULL
                    THEN ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography
                    ELSE NULL
                END,
                %s,
                %s,
                %s,
                %s,
                %s,
                'pending_review',
                %s
            )
            RETURNING {SELECT_COLUMNS};
            """,
            (
                payload.name,
                payload.category,
                payload.longitude,
                payload.latitude,
                payload.longitude,
                payload.latitude,
                payload.address,
                payload.construction_period,
                payload.historical_significance,
                payload.description,
                payload.image_url,
                str(user_id),
            ),
        )

        return cur.fetchone()


def get_my_submissions(
    conn: connection,
    user_id: UUID,
):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            f"""
            SELECT {SELECT_COLUMNS}
            FROM heritage_sites
            WHERE submitted_by = %s
            ORDER BY created_at DESC;
            """,
            (str(user_id),),
        )

        return cur.fetchall()


def get_my_submission(
    conn: connection,
    user_id: UUID,
    submission_id: UUID,
):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            f"""
            SELECT {SELECT_COLUMNS}
            FROM heritage_sites
            WHERE id = %s
              AND submitted_by = %s;
            """,
            (
                str(submission_id),
                str(user_id),
            ),
        )

        return cur.fetchone()