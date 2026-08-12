import os
import sys
import time
import json
import csv
import re
import psycopg2
from tavily import TavilyClient
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import settings
from rag.llm_client import generate_answer

load_dotenv()

def search_tavily(query):
    print(f"Searching Tavily for: '{query}'")
    api_key = os.environ.get("TAVILY_API_KEY")
    if not api_key:
        print("TAVILY_API_KEY not found in .env!")
        return ""
        
    try:
        client = TavilyClient(api_key=api_key)
        # Advanced search returns full raw content of up to 5 sites
        response = client.search(
            query=query, 
            search_depth="advanced", 
            include_raw_content=True,
            max_results=3
        )
        
        results = []
        for result in response.get('results', []):
            raw = result.get('raw_content') or result.get('content') or ""
            url = result.get('url')
            if raw and url:
                results.append((url, raw[:8000]))
            
        return results
    except Exception as e:
        print(f"Error during Tavily search: {e}")
        return []

def extract_sites_with_ai(text):
    if not text:
        return []

    prompt = f"""
    Analyze the following web page text and extract any hidden or lesser-known heritage/historical sites located in Pune, India.
    Return the result strictly as a JSON array of objects. Do not include markdown codeblocks, just raw JSON.
    If no sites are found, return [].
    Each object must have the following keys:
    - name: String (name of the site)
    - category: String (must be one of: 'built', 'natural', 'craft', 'intangible')
    - address: String (approximate location in Pune)
    - construction_period: String (e.g. '17th Century' or 'Unknown')
    - historical_significance: String (1-2 sentences)
    - description: String (3-4 engaging sentences for an audio guide)

    Text:
    {text[:15000]}
    """
    
    try:
        # Higher max_tokens than the RAG chat default (1024): this prompt
        # can return several sites' worth of JSON objects, and a truncated
        # array fails json.loads() below - silently discarding real results
        # instead of erroring loudly.
        result_text = generate_answer(
            [{"role": "user", "content": prompt}],
            max_tokens=4096,
        ).strip()

        # Clean up possible markdown wrappers
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.startswith("```"):
            result_text = result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]

        sites = json.loads(result_text.strip())
        return sites
    except Exception as e:
        print(f"Error extracting data with NVIDIA: {e}")
        return []

def normalize_name(name):
    # Remove all non-alphanumeric characters (spaces, punctuation) and lowercase
    return re.sub(r'[^a-z0-9]', '', name.lower())

def get_existing_sites(cur):
    cur.execute("SELECT name FROM heritage_sites")
    # Return a set of fully normalized names (no spaces or punctuation)
    return {normalize_name(row[0]) for row in cur.fetchall()}

def get_pune_region_id(cur):
    cur.execute("SELECT id FROM regions WHERE name ILIKE 'Pune' LIMIT 1")
    row = cur.fetchone()
    if row:
        return row[0]
    # Create Pune region if it doesn't exist
    cur.execute("INSERT INTO regions (name, description) VALUES ('Pune', 'Pune City Region') RETURNING id")
    return cur.fetchone()[0]

def main():
    queries = [
        "top hidden heritage sites in Pune",
        "unknown historical places Pune"
    ]
    
    extracted_sites = []
    
    for q in queries:
        tavily_results = search_tavily(q)
        for url, text in tavily_results:
            sites = extract_sites_with_ai(text)
            if isinstance(sites, list) and len(sites) > 0:
                for s in sites:
                    s['source_url'] = url
                extracted_sites.extend(sites)
                print(f"  -> Extracted {len(sites)} sites from {url}")
            time.sleep(3) # Small delay to respect limits
        time.sleep(5)
        
    if not extracted_sites:
        print("No sites were extracted.")
        return
        
    print(f"Total extracted potential sites: {len(extracted_sites)}")
    
    csv_file = "added_hidden_sites.csv"
    csv_headers = ['name', 'source_url', 'category', 'address', 'construction_period', 'historical_significance', 'description']
    
    conn = psycopg2.connect(settings.database_url)
    try:
        with conn.cursor() as cur:
            existing_names = get_existing_sites(cur)
            pune_region_id = get_pune_region_id(cur)
            
            inserted = 0
            with open(csv_file, mode='w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=csv_headers)
                writer.writeheader()
                
                for site in extracted_sites:
                    name = site.get('name', '').strip()
                    if not name:
                        continue
                        
                    normalized_name = normalize_name(name)
                        
                    # Fuzzy match check (ignores spaces, casing, and punctuation)
                    if normalized_name in existing_names:
                        print(f"Skipping '{name}': Already exists in database.")
                        continue
                        
                    print(f"Inserting new site: {name}")
                    cur.execute("""
                        INSERT INTO heritage_sites 
                        (name, category, address, construction_period, historical_significance, description, status, region_id)
                        VALUES (%s, %s, %s, %s, %s, %s, 'pending_review', %s)
                    """, (
                        name,
                        site.get('category', 'built'),
                        site.get('address', 'Pune, Maharashtra'),
                        site.get('construction_period', 'Unknown'),
                        site.get('historical_significance', ''),
                        site.get('description', ''),
                        pune_region_id
                    ))
                    existing_names.add(normalized_name)
                    inserted += 1
                    
                    writer.writerow({
                        'name': name,
                        'source_url': site.get('source_url', ''),
                        'category': site.get('category', 'built'),
                        'address': site.get('address', 'Pune, Maharashtra'),
                        'construction_period': site.get('construction_period', 'Unknown'),
                        'historical_significance': site.get('historical_significance', ''),
                        'description': site.get('description', '')
                    })
                
            conn.commit()
            print(f"Successfully inserted {inserted} new hidden heritage sites.")
            print(f"Reference CSV created at: {os.path.abspath(csv_file)}")
            
    except Exception as e:
        conn.rollback()
        print(f"Database error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    main()
