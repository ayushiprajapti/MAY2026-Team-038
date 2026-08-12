import os
import sys
import psycopg2

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import settings

def main():
    conn = psycopg2.connect(settings.database_url)
    try:
        with conn.cursor() as cur:
            # Find all variations
            cur.execute("SELECT id, name FROM heritage_sites WHERE name ILIKE '%shaniwar%'")
            sites = cur.fetchall()
            print("Found sites:", sites)
            
            # If both exist, let's delete the one named 'Shaniwarwada' (no space) 
            # and keep 'Shaniwar Wada' which is properly formatted and has the new description.
            for s in sites:
                if s[1] == 'Shaniwarwada':
                    print(f"Archiving duplicate: {s[1]} (id: {s[0]})")
                    cur.execute("UPDATE heritage_sites SET status = 'rejected', name = 'Shaniwarwada (Duplicate)' WHERE id = %s", (s[0],))
            
            conn.commit()
            print("Cleanup complete.")
    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    main()
