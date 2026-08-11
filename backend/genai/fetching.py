import sys
import os
import requests
import psycopg2
import urllib.parse
from uuid import UUID

# Add parent directory to path so we can import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import settings

WIKIPEDIA_API_URL = "https://en.wikipedia.org/w/api.php"

def fetch_wikipedia_details(site_name: str) -> dict:
    """
    Search Wikipedia for the given site name.
    Returns a dictionary with 'description' and 'image_url' if found.
    """
    params = {
        "action": "query",
        "prop": "extracts|pageimages",
        "piprop": "original",
        "exintro": 1,
        "explaintext": 1,
        "titles": site_name,
        "format": "json",
        "redirects": 1
    }
    
    headers = {
        "User-Agent": "IntachHeritageApp/1.0 (contact@intach.org) python-requests/2.32"
    }
    
    try:
        response = requests.get(WIKIPEDIA_API_URL, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        pages = data.get("query", {}).get("pages", {})
        if not pages:
            return {}
            
        # The pages dict has page IDs as keys. Get the first one.
        page = list(pages.values())[0]
        
        # If the page is missing (-1 is usually the key for missing pages)
        if "missing" in page:
            return {}
            
        result = {}
        if "extract" in page and page["extract"]:
            # Truncate if it's too long, but usually Wikipedia intros are fine
            result["description"] = page["extract"].strip()
            
        if "original" in page and "source" in page["original"]:
            result["image_url"] = page["original"]["source"]
            
        return result
        
    except Exception as e:
        print(f"Error fetching Wikipedia data for {site_name}: {e}")
        return {}


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    print(f"Connecting to database: {settings.database_url.split('@')[-1]}")
    conn = psycopg2.connect(settings.database_url)
    
    try:
        with conn.cursor() as cur:
            # Find sites missing description or image
            cur.execute("""
                SELECT id, name, description, image_url
                FROM heritage_sites
                WHERE description IS NULL OR image_url IS NULL OR description = ''
            """)
            
            missing_sites = cur.fetchall()
            print(f"Found {len(missing_sites)} sites missing descriptions or images.")
            
            updates = 0
            for site_id, name, current_desc, current_img in missing_sites:
                print(f"Fetching details for: {name}...")
                
                details = fetch_wikipedia_details(name)
                
                if not details:
                    print(f"  - No Wikipedia data found for {name}")
                    continue
                    
                new_desc = current_desc
                new_img = current_img
                
                if (not current_desc or current_desc == '') and "description" in details:
                    new_desc = details["description"]
                    print(f"  - Found description ({len(new_desc)} chars)")
                    
                if not current_img and "image_url" in details:
                    new_img = details["image_url"]
                    print(f"  - Found image: {new_img}")
                    
                if new_desc != current_desc or new_img != current_img:
                    cur.execute("""
                        UPDATE heritage_sites
                        SET description = %s, image_url = %s
                        WHERE id = %s
                    """, (new_desc, new_img, site_id))
                    updates += 1
                    
                    # Commit every 10 updates to avoid losing work on crash
                    if updates % 10 == 0:
                        conn.commit()
            
            conn.commit()
            print(f"Successfully updated {updates} sites.")
            
    except Exception as e:
        conn.rollback()
        print(f"Database error: {e}")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
