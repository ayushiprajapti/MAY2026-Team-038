from database import get_db
conn = next(get_db())
cursor = conn.cursor()
cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'heritage_sites';")
print([r[0] for r in cursor.fetchall()])
