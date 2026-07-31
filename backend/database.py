from typing import Iterator

import psycopg2
import psycopg2.extras
from psycopg2.pool import SimpleConnectionPool

from config import settings

# Without this, uuid/uuid[] columns (e.g. chat_messages.referenced_site_ids)
# come back from fetches as raw strings like '{}' instead of Python lists.
psycopg2.extras.register_uuid()

pool = SimpleConnectionPool(minconn=0, maxconn=10, dsn=settings.database_url)


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
