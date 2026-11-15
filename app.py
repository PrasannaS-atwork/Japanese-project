"""
Nihon no Tabi (日本の旅) - Japan Tourism Explorer
=================================================
A Flask web interface for the `japan_tourism` MySQL database.

Run:
    python app.py
Then open http://127.0.0.1:5000

The app talks to MySQL when it is reachable. If MySQL is down (or the
credentials differ on another machine) it falls back to parsing the
`japan_tourism.sql` dump that sits next to this file, so the UI always works.
"""

import os
import re
import sys
import json
import random
from pathlib import Path

from flask import Flask, jsonify, render_template, request

try:
    import mysql.connector
    from mysql.connector import Error as MySQLError
except ImportError:  # pragma: no cover - lets the UI run without the driver
    mysql = None

    class MySQLError(Exception):
        pass


BASE_DIR = Path(__file__).resolve().parent
SQL_DUMP = BASE_DIR / "japan_tourism.sql"
META_FILE = BASE_DIR / "data" / "places_meta.json"

app = Flask(__name__)


def load_env_file(path=None):
    """Read KEY=value lines from a local .env file.

    The .env file holds the MySQL password and is listed in .gitignore, so the
    password never reaches GitHub. Copy .env.example to .env and fill it in.
    """
    path = path or BASE_DIR / ".env"
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file()

DB_CONFIG = {
    "host": os.environ.get("MYSQL_HOST", "localhost"),
    "user": os.environ.get("MYSQL_USER", "root"),
    "password": os.environ.get("MYSQL_PASSWORD", ""),
    "database": os.environ.get("MYSQL_DATABASE", "japan_tourism"),
}

# Filled in on first use: "mysql" or "sql-dump"
DATA_SOURCE = {"mode": "unknown", "detail": ""}


# ---------------------------------------------------------------------------
# Data access
# ---------------------------------------------------------------------------
def fetch_from_mysql():
    """Return [(place_name, description), ...] from MySQL, or None on failure."""
    if mysql is None:
        DATA_SOURCE.update(mode="sql-dump", detail="mysql-connector-python not installed")
        return None
    try:
        con = mysql.connector.connect(connection_timeout=4, **DB_CONFIG)
        cur = con.cursor()
        cur.execute("SELECT place_name, description FROM places ORDER BY place_name")
        rows = cur.fetchall()
        cur.close()
        con.close()
        DATA_SOURCE.update(mode="mysql", detail=f"{DB_CONFIG['database']}@{DB_CONFIG['host']}")
        return rows
    except (MySQLError, Exception) as exc:  # noqa: BLE001 - any driver issue -> fallback
        DATA_SOURCE.update(mode="sql-dump", detail=f"MySQL unavailable: {exc}".split("\n")[0][:160])
        return None


def fetch_from_dump():
    """Parse the INSERT statement in japan_tourism.sql as an offline fallback."""
    if not SQL_DUMP.exists():
        return []
    text = SQL_DUMP.read_text(encoding="utf-8", errors="replace")
    body = ""
    for match in re.finditer(r"INSERT INTO `places` VALUES\s*(.*?);", text, re.S):
        body += match.group(1)
    pattern = re.compile(r"\('((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)'\)", re.S)
    rows = []
    for name, desc in pattern.findall(body):
        unescape = lambda s: s.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")
        rows.append((unescape(name), unescape(desc)))
    return sorted(rows, key=lambda r: r[0])


def load_meta():
    """Category / region / Japanese-name metadata for each place."""
    if META_FILE.exists():
        return json.loads(META_FILE.read_text(encoding="utf-8"))
    return {}


def get_places(force_reload=False):
    """All places, enriched with metadata. Cached on the app object."""
    if force_reload or not hasattr(app, "_places_cache"):
        rows = fetch_from_mysql()
        if rows is None:
            rows = fetch_from_dump()
        meta = load_meta()
        default = {"jp": "", "category": "culture", "region": "Japan", "season": "All year"}
        places = []
        for name, description in rows:
            info = meta.get(name, default)
            places.append(
                {
                    "name": name,
                    "description": description,
                    "jp": info.get("jp", ""),
                    "romaji": info.get("romaji", ""),
                    "category": info.get("category", "culture"),
                    "region": info.get("region", "Japan"),
                    "season": info.get("season", "All year"),
                }
            )
        app._places_cache = places
    return app._places_cache


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
CATEGORY_LABELS = {
    "shrine": {"en": "Shrines", "jp": "神社"},
    "temple": {"en": "Temples", "jp": "寺院"},
    "castle": {"en": "Castles", "jp": "城"},
    "mountain": {"en": "Mountains", "jp": "山"},
    "nature": {"en": "Nature", "jp": "自然"},
    "garden": {"en": "Gardens & Parks", "jp": "庭園"},
    "onsen": {"en": "Hot Springs", "jp": "温泉"},
    "city": {"en": "City Life", "jp": "都市"},
    "culture": {"en": "Culture", "jp": "文化"},
    "island": {"en": "Islands & Sea", "jp": "島"},
    "peace": {"en": "Peace Memorials", "jp": "平和"},
}


@app.route("/")
def index():
    places = get_places()
    categories = []
    for key, label in CATEGORY_LABELS.items():
        count = sum(1 for p in places if p["category"] == key)
        if count:
            categories.append({"key": key, "count": count, **label})
    regions = sorted({p["region"] for p in places})
    return render_template(
        "index.html",
        places=places,
        categories=categories,
        regions=regions,
        total=len(places),
        source=DATA_SOURCE,
    )


@app.route("/api/places")
def api_places():
    return jsonify(get_places())


@app.route("/api/search")
def api_search():
    """Search by name, Japanese name, region or words in the description."""
    q = (request.args.get("q") or "").strip().lower()
    category = request.args.get("category") or ""
    region = request.args.get("region") or ""
    results = get_places()
    if category and category != "all":
        results = [p for p in results if p["category"] == category]
    if region and region != "all":
        results = [p for p in results if p["region"] == region]
    if q:
        def rank(p):
            name = p["name"].lower()
            if name == q:
                return 0                      # exact name
            if name.startswith(q):
                return 1                      # name starts with the query
            if q in name or q in p["jp"] or q in p["romaji"].lower():
                return 2                      # name contains it
            if q in p["region"].lower() or q in p["category"]:
                return 3                      # region or category
            if q in p["description"].lower():
                return 4                      # mentioned in the description
            return 99

        results = sorted(
            [p for p in results if rank(p) < 99],
            key=lambda p: (rank(p), p["name"]),
        )
    return jsonify({"query": q, "count": len(results), "results": results})


@app.route("/api/place/<path:name>")
def api_place(name):
    for p in get_places():
        if p["name"].lower() == name.strip().lower():
            return jsonify(p)
    return jsonify({"error": "Place not found!", "name": name}), 404


@app.route("/api/random")
def api_random():
    places = get_places()
    return jsonify(random.choice(places) if places else {})


@app.route("/api/status")
def api_status():
    get_places()
    return jsonify({"source": DATA_SOURCE, "places": len(get_places())})


if __name__ == "__main__":
    # Windows consoles default to cp1252 and cannot print kanji.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

    places = get_places()
    print("\n  日本の旅  Nihon no Tabi - Japan Tourism Explorer")
    print(f"  {len(places)} places loaded from {DATA_SOURCE['mode']} ({DATA_SOURCE['detail']})")
    print("  Open http://127.0.0.1:5000\n")
    app.run(debug=True, port=5000)
