from typing import Iterator

import psycopg2
import psycopg2.extras
from psycopg2.pool import SimpleConnectionPool

from config import settings

# Without this, uuid/uuid[] columns (e.g. chat_messages.referenced_site_ids)
# come back from fetches as raw strings like '{}' instead of Python lists.
psycopg2.extras.register_uuid()


# minconn=0 previously meant psycopg2's SimpleConnectionPool.putconn()
# always closed the returned connection instead of keeping it for reuse
# (its internal "len(pool) < minconn" check was 0 < 0, always false) - so
# every single request paid a full fresh-connection handshake (~1.5s to
# the remote DB), regardless of any query-level caching. minconn=2 lets
# putconn() actually retain idle connections.
pool = SimpleConnectionPool(minconn=2, maxconn=10, dsn=settings.database_url)


def get_db() -> Iterator[psycopg2.extensions.connection]:
    conn = pool.getconn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        pool.putconn(conn)
