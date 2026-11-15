"""The original command-line version of this project.

It asks for a place name and prints its description from the MySQL database.
The web version (app.py) uses the same table.

The database password is read from the .env file beside this script, so it is
never written inside the code. Copy .env.example to .env and fill it in.
"""

import os
from pathlib import Path

import mysql.connector


def load_env_file():
    """Read KEY=value lines from the local .env file (never committed)."""
    env_path = Path(__file__).resolve().parent / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file()

# Establish connection
con = mysql.connector.connect(
    host=os.environ.get("MYSQL_HOST", "localhost"),
    user=os.environ.get("MYSQL_USER", "root"),
    password=os.environ.get("MYSQL_PASSWORD", ""),
    database=os.environ.get("MYSQL_DATABASE", "japan_tourism"),
)

cur = con.cursor()

# Get input from user
name = input("Enter the name of the place: ")

# Search in SQL database
query = "SELECT description FROM places WHERE place_name = %s"
cur.execute(query, (name,))

# Retrieve result
result = cur.fetchone()

# Display output
if result:
    print("\nDescription:")
    print(result[0])
else:
    print("Place not found!")

# Close connection
cur.close()
con.close()
