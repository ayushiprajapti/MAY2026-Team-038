from uuid import UUID

import psycopg2
from fastapi import HTTPException, status
from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor

from database import pool
from utils.cache import cached

SELECT_COLUMNS = """
    id, name, category, address, construction_period, historical_significance,
    description, image_url, status, submitted_by, reviewed_by, reviewed_at,
    review_notes, region_id, created_at, updated_at,
    ST_Y(location::geometry) AS latitude,
    ST_X(location::geometry) AS longitude
"""

# RETURNING (used by approve/reject/delete) can't reference a joined table,
# so this variant - with the region name - is only used by the two plain
# SELECT queries below.
SELECT_COLUMNS_WITH_REGION = """
    hs.id, hs.name, hs.category, hs.address, hs.construction_period,
    hs.historical_significance, hs.description, hs.image_url, hs.status,
    hs.submitted_by, hs.reviewed_by, hs.reviewed_at, hs.review_notes,
    hs.region_id, hs.created_at, hs.updated_at,
    ST_Y(hs.location::geometry) AS latitude,
    ST_X(hs.location::geometry) AS longitude,
    r.name AS region_name
"""


def _build_where(status_filter: str | None, category: str | None, region_id: str | None):
    where_clauses = []
    params: list = []

    if status_filter:
        where_clauses.append("hs.status = %s")
        params.append(status_filter)
    if category:
        where_clauses.append("hs.category = %s")
        params.append(category)
    if region_id:
        where_clauses.append("hs.region_id = %s")
        params.append(region_id)

    where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
    return where_sql, params


@cached(ttl_seconds=60)
def get_pending_submissions(
    conn: connection,
    status_filter: str | None = "pending_review",
    category: str | None = None,
    region_id: str | None = None,
):
    where_sql, params = _build_where(status_filter, category, region_id)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            f"""
                SELECT {SELECT_COLUMNS_WITH_REGION}
                FROM heritage_sites hs
                LEFT JOIN regions r ON hs.region_id = r.id
                {where_sql}
                ORDER BY (hs.description IS NULL OR hs.description = '') ASC, hs.created_at DESC;
            """,
            tuple(params),
        )

        return cur.fetchall()


def get_submissions_page(
    conn: connection,
    status_filter: str | None,
    category: str | None,
    region_id: str | None,
    page: int,
    page_size: int,
):
    """Real LIMIT/OFFSET query for just the requested page - used as the
    fast path on a cache miss, so the visible page never waits on a full
    unfiltered fetch. Not cached itself: it's already a cheap indexed
    range query, and get_pending_submissions.cache_clear() has no way to
    know about entries here anyway."""
    where_sql, params = _build_where(status_filter, category, region_id)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            f"SELECT COUNT(*) AS total FROM heritage_sites hs {where_sql};",
            tuple(params),
        )
        total = cur.fetchone()["total"]

        offset = (page - 1) * page_size
        cur.execute(
            f"""
                SELECT {SELECT_COLUMNS_WITH_REGION}
                FROM heritage_sites hs
                LEFT JOIN regions r ON hs.region_id = r.id
                {where_sql}
                ORDER BY (hs.description IS NULL OR hs.description = '') ASC, hs.created_at DESC
                LIMIT %s OFFSET %s;
            """,
            tuple(params) + (page_size, offset),
        )
        items = cur.fetchall()

    return items, total


def warm_pending_submissions_cache(
    status_filter: str | None,
    category: str | None,
    region_id: str | None,
) -> None:
    """Background-task entry point: populates get_pending_submissions'
    cache for this filter combo using its own pooled connection - never
    reuse the request's conn here, it's already back in the pool by the
    time a BackgroundTasks callback runs."""
    conn = pool.getconn()
    try:
        get_pending_submissions(conn, status_filter, category=category, region_id=region_id)
    finally:
        pool.putconn(conn)


@cached(ttl_seconds=300)
def get_all_regions(conn: connection):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id, name FROM regions ORDER BY name;")
        return cur.fetchall()


def get_submission_by_id(conn: connection, submission_id: UUID):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(f"""
            SELECT {SELECT_COLUMNS_WITH_REGION}
            FROM heritage_sites hs
            LEFT JOIN regions r ON hs.region_id = r.id
            WHERE hs.id = %s;
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

        result = cur.fetchone()

    get_pending_submissions.cache_clear()
    return result


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

        result = cur.fetchone()

    get_pending_submissions.cache_clear()
    return result


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

        result = cur.fetchone()

    get_pending_submissions.cache_clear()
    return result
