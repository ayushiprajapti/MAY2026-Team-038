import os
import sys
import psycopg2

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import settings

def main():
    conn = psycopg2.connect(settings.database_url)
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT name, image_url FROM heritage_sites WHERE image_url IS NOT NULL LIMIT 5")
            print(cur.fetchall())
    finally:
        conn.close()

if __name__ == "__main__":
    main()
