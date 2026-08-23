from database import get_db
conn = next(get_db())
cursor = conn.cursor()
cursor.execute("SELECT id, name FROM heritage_sites WHERE name ILIKE '%Shaniwar%';")
sites = cursor.fetchall()
print("Sites:", sites)
for site in sites:
    cursor.execute("SELECT count(*) FROM heritage_site_embeddings WHERE site_id = %s;", (site[0],))
    print(f"Embeddings for {site[1]}:", cursor.fetchone()[0])
