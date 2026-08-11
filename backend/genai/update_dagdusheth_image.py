import os
import sys
import psycopg2

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import settings

def main():
    conn = psycopg2.connect(settings.database_url)
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE heritage_sites 
                SET image_url = '/dagdusheth.png' 
                WHERE name ILIKE '%dagdusheth%'
            """)
            print(f"Updated {cur.rowcount} rows to use generated local image.")
            conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    main()
