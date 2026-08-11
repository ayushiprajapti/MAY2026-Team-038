import urllib.request
import os

url = "https://upload.wikimedia.org/wikipedia/commons/e/ea/Dagdushet_Halwai_Ganpati_Mandir_Pune_By_Vaibhav_Rane.JPG"
file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "dagdusheth.jpg"))

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response, open(file_path, 'wb') as out_file:
    data = response.read()
    out_file.write(data)
    
print(f"Downloaded image to {file_path}")
