from typing import Iterator

import psycopg2
from psycopg2.pool import SimpleConnectionPool

from config import settings

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
