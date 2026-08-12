import os
import sys
import time
import psycopg2
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import settings

def main():
    print("Connecting to database...")
    conn = psycopg2.connect(settings.database_url)
    
    geolocator = Nominatim(user_agent="pune_heritage_app")
    
    try:
        with conn.cursor() as cur:
            # Find sites with no location
            cur.execute("""
                SELECT id, name, address 
                FROM heritage_sites 
                WHERE location IS NULL
            """)
            sites = cur.fetchall()
            
            if not sites:
                print("All sites already have coordinates!")
                return
                
            print(f"Found {len(sites)} sites missing coordinates.")
            updated = 0
            
            for site_id, name, address in sites:
                # Add 'Pune, Maharashtra' to improve geocoding accuracy if it's missing
                search_query = f"{name}, Pune, Maharashtra, India"
                print(f"Geocoding: {search_query}")
                
                try:
                    location = geolocator.geocode(search_query, timeout=10)
                    
                    if not location:
                        # Fallback to just the name and Pune
                        location = geolocator.geocode(f"{name}, Pune", timeout=10)
                        
                    if location:
                        print(f"  -> Found: {location.latitude}, {location.longitude}")
                        
                        # Update DB with PostGIS geometry Point(lon, lat) using SRID 4326 (WGS84)
                        cur.execute("""
                            UPDATE heritage_sites 
                            SET location = ST_SetSRID(ST_MakePoint(%s, %s), 4326)
                            WHERE id = %s
                        """, (location.longitude, location.latitude, site_id))
                        updated += 1
                    else:
                        print(f"  -> Could not find coordinates for '{name}'")
                        
                except GeocoderTimedOut:
                    print(f"  -> Timed out while searching for '{name}'")
                except Exception as e:
                    print(f"  -> Error: {e}")
                    
                time.sleep(1) # Respect Nominatim usage policy (1 request per second max)
                
            conn.commit()
            print(f"Successfully updated {updated} out of {len(sites)} sites with coordinates.")
            
    except Exception as e:
        conn.rollback()
        print(f"Database error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    main()
