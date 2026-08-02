from __future__ import annotations

import logging
from uuid import uuid4

from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor

from rag import llm_client
from rag.chunking import build_site_chunk
from rag.vector_format import to_pgvector_literal

logger = logging.getLogger(__name__)

SELECT_APPROVED_SITES = """
SELECT
    hs.id,
    hs.name,
    hs.category,
    hs.address,
    hs.construction_period,
    hs.historical_significance,
    hs.description,
    r.name AS region_name,
    COALESCE(
        array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '{}'
    ) AS theme_names
FROM heritage_sites hs
LEFT JOIN regions r ON r.id = hs.region_id
LEFT JOIN heritage_site_themes hst ON hst.site_id = hs.id
LEFT JOIN themes t ON t.id = hst.theme_id
WHERE hs.status = 'approved'
GROUP BY hs.id, r.name
"""

UPSERT_EMBEDDING = """
INSERT INTO heritage_site_embeddings (id, site_id, content_chunk, embedding, created_at)
VALUES (%(id)s, %(site_id)s, %(content_chunk)s, %(embedding)s::vector, now())
ON CONFLICT (site_id) DO UPDATE
SET content_chunk = EXCLUDED.content_chunk,
    embedding = EXCLUDED.embedding,
    created_at = now()
"""


def index_approved_sites(conn: connection) -> dict[str, int]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(SELECT_APPROVED_SITES)
        sites = cur.fetchall()

    if not sites:
        return {"total": 0, "indexed": 0}

    chunks = [build_site_chunk(dict(site)) for site in sites]
    embeddings = llm_client.embed_texts(chunks, input_type="passage")

    with conn.cursor() as cur:
        for site, chunk, embedding in zip(sites, chunks, embeddings):
            cur.execute(
                UPSERT_EMBEDDING,
                {
                    "id": str(uuid4()),
                    "site_id": site["id"],
                    "content_chunk": chunk,
                    "embedding": to_pgvector_literal(embedding),
                },
            )

    return {"total": len(sites), "indexed": len(sites)}


def main() -> None:
    import psycopg2

    from config import settings

    logging.basicConfig(level=logging.INFO)
    conn = psycopg2.connect(settings.database_url)
    try:
        summary = index_approved_sites(conn)
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    logger.info("Indexing complete: %s", summary)


if __name__ == "__main__":
    main()
