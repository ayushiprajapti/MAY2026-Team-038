from database import get_db
conn = next(get_db())
cursor = conn.cursor()
cursor.execute("SELECT id, name, status FROM heritage_sites WHERE name ILIKE '%Shaniwar%';")
print(cursor.fetchall())
