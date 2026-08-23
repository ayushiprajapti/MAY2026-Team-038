from database import get_db
conn = next(get_db())
cursor = conn.cursor()
cursor.execute("SELECT name, ST_Y(location::geometry) AS latitude, ST_X(location::geometry) AS longitude FROM heritage_sites LIMIT 5;")
print(cursor.fetchall())
