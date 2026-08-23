from database import get_db
conn = next(get_db())
cursor = conn.cursor()
cursor.execute("SELECT name, latitude, longitude FROM heritage_sites LIMIT 5;")
print(cursor.fetchall())
