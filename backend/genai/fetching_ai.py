import os
import sys
import time
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import psycopg2
from config import settings
from dotenv import load_dotenv
from rag.llm_client import generate_answer

load_dotenv()

sys.stdout.reconfigure(encoding='utf-8')

def main():
    print(f"Connecting to database: {settings.database_url.split('@')[-1]}")
    conn = psycopg2.connect(settings.database_url)

    if not settings.nvidia_api_key:
        print("NVIDIA_API_KEY not found in .env file!")
        return

    updates = 0
    try:
        with conn.cursor() as cur:
            # Find sites missing description
            cur.execute("""
                SELECT id, name
                FROM heritage_sites
                WHERE description IS NULL OR description = ''
            """)
            missing_sites = cur.fetchall()
            print(f"Found {len(missing_sites)} sites missing descriptions.")

            for site_id, name in missing_sites:
                print(f"Generating description via NVIDIA for: {name}...")

                try:
                    new_desc = generate_answer([
                        {
                            "role": "user",
                            "content": (
                                f"Write a 3-4 sentence historically accurate and engaging "
                                f"description for the Indian heritage site '{name}' located "
                                f"in Maharashtra. This is for an audio tour guide. Do not "
                                f"include any preambles, just the description itself."
                            ),
                        }
                    ]).strip()

                    if new_desc:
                        print(f"  - Generated description ({len(new_desc)} chars)")
                        cur.execute("""
                            UPDATE heritage_sites
                            SET description = %s
                            WHERE id = %s
                        """, (new_desc, site_id))
                        updates += 1

                        if updates % 5 == 0:
                            conn.commit()

                        # Small delay to stay well under NVIDIA's rate limits
                        time.sleep(2)

                except Exception as api_err:
                    print(f"  - Error generating description: {api_err}")
                    time.sleep(2)

            conn.commit()
            print(f"Successfully generated and updated {updates} sites using NVIDIA.")

    except Exception as e:
        conn.rollback()
        print(f"Database error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    main()
