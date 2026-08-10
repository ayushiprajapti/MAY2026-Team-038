"""One-off migration for the RAG chatbot feature. create_schema.py already
ran against the dev database in an earlier session and isn't idempotent, so
this applies just the two changes the RAG feature needs: resizing the
embedding column to match nv-embedqa-e5-v5 (1024-dim) and adding the unique
constraint indexing.py's upsert relies on.

Run once:
    cd backend
    source venv/bin/activate
    python -m db.migrate_rag_schema
"""

import psycopg2

from config import settings

STATEMENTS = """
ALTER TABLE heritage_site_embeddings ALTER COLUMN embedding TYPE vector(1024);
CREATE UNIQUE INDEX IF NOT EXISTS ux_heritage_site_embeddings_site ON heritage_site_embeddings (site_id);
"""


def main() -> None:
    conn = psycopg2.connect(settings.database_url)
    try:
        with conn.cursor() as cur:
            cur.execute(STATEMENTS)
        conn.commit()
        print("RAG schema migration applied.")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
