import psycopg2
from config import settings
conn=psycopg2.connect(settings.database_url)
cur=conn.cursor()
cur.execute('SELECT description, image_url FROM heritage_sites WHERE name=''Aga Khan Palace''')
print(cur.fetchall())
