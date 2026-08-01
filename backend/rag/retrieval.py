from __future__ import annotations

from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor

from rag import llm_client, local_reranker
from rag.vector_format import to_pgvector_literal

CANDIDATE_LIMIT = 20
MAX_RELEVANT_DISTANCE = 0.6  # cosine distance cutoff; retune once real query logs exist

FIND_REGION_MATCH = """
SELECT id FROM regions WHERE %(query)s ILIKE ('%%' || name || '%%') LIMIT 1
"""

FIND_THEME_MATCH = """
SELECT id FROM themes WHERE %(query)s ILIKE ('%%' || name || '%%') LIMIT 1
"""

KNN_BASE = """
SELECT hs.id AS site_id, hs.name, e.content_chunk,
       e.embedding <=> %(query_vector)s::vector AS distance
FROM heritage_site_embeddings e
JOIN heritage_sites hs ON hs.id = e.site_id
WHERE hs.status = 'approved'
"""


def _find_region_id(conn: connection, query: str) -> str | None:
    with conn.cursor() as cur:
        cur.execute(FIND_REGION_MATCH, {"query": query})
        row = cur.fetchone()
        return row[0] if row else None


def _find_theme_id(conn: connection, query: str) -> str | None:
    with conn.cursor() as cur:
        cur.execute(FIND_THEME_MATCH, {"query": query})
        row = cur.fetchone()
        return row[0] if row else None


def retrieve_relevant_sites(conn: connection, query: str, k: int = 5) -> list[dict]:
    region_id = _find_region_id(conn, query)
    theme_id = _find_theme_id(conn, query)

    query_embedding = llm_client.embed_texts([query], input_type="query")[0]
    params: dict = {"query_vector": to_pgvector_literal(query_embedding)}

    sql = KNN_BASE
    if region_id:
        sql += " AND hs.region_id = %(region_id)s"
        params["region_id"] = region_id
    if theme_id:
        sql += (
            " AND hs.id IN (SELECT site_id FROM heritage_site_themes WHERE theme_id = %(theme_id)s)"
        )
        params["theme_id"] = theme_id
    sql += " ORDER BY distance LIMIT %(limit)s"
    params["limit"] = CANDIDATE_LIMIT

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(sql, params)
        candidates = cur.fetchall()

    candidates = [c for c in candidates if c["distance"] <= MAX_RELEVANT_DISTANCE]
    if not candidates:
        return []

    try:
        ranked_indices = local_reranker.rerank(query, [c["content_chunk"] for c in candidates])
        return [candidates[i] for i in ranked_indices[:k]]
    except Exception:
        # Reranking is a precision upgrade on top of plain vector distance,
        # not a hard requirement - if the local reranker fails for any
        # reason, fall back to the KNN distance order rather than failing
        # the whole chat turn.
        return candidates[:k]
