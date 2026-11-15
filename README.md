# Japan Explorer — a Japanese-culture UI for the `japan_tourism` database

A Flask web interface for the MySQL database the original `japanese project.py` script used.
Same data, same table — now with a culture primer, illustrations and animation.

## Run it

```bash
pip install -r requirements.txt
python app.py
```

Then open **http://127.0.0.1:5000**

### Database settings

Copy `.env.example` to `.env` and fill in your own MySQL details:

```bash
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=japan_tourism
```

`.env` is listed in `.gitignore`, so your password stays on your own machine.
Both `app.py` and the original `japanese project.py` read it from there.

If MySQL is not reachable, the app parses `japan_tourism.sql` instead, so the page still works
on any machine. The footer badge says which source is live.

## What's in the page

| Section | Contents |
| --- | --- |
| Hero | Parallax scene: drifting clouds, flying cranes, Mt Fuji, moving seigaiha waves, torii gate, swaying cherry tree and glowing lanterns |
| Culture | Eight-card primer — harmony, wabi-sabi, Shinto & Buddhism, tea, festivals, onsen etiquette, food, arts |
| Seasons | Four season cards; clicking one repaints the whole site and filters places by best season |
| Places | All 50 places from the database — live search, category chips, region filter, detail panel |
| Phrases | Ten flip cards with useful Japanese phrases |

### Animations
Falling sakura petals (summer: fireflies, autumn: maple leaves, winter: snow) on a canvas layer;
hero parallax on scroll and mouse; ink-brush stroke that draws itself; noren curtain intro;
counters that count up; scroll-reveal for every section; card hover lift and image zoom;
sliding detail panel; animation inside each illustration (koi swimming, steam rising, neon flicker,
cranes flying, lanterns swaying).

All motion is disabled automatically for visitors with `prefers-reduced-motion`.

## Files

```
app.py                     Flask app — MySQL access, search API, SQL-dump fallback
data/places_meta.json      Japanese name, category, region and best season for each place
templates/index.html       The page
static/css/style.css       Theme, seasons, day/night, animation
static/js/app.js           Search, filters, detail panel, parallax, season switching
static/js/particles.js     Season-aware particle canvas
static/img/*.svg           11 hand-drawn animated scenes, one per category
japanese project.py        The original command-line version (unchanged)
```

## API

| Route | Purpose |
| --- | --- |
| `GET /api/places` | All places with metadata |
| `GET /api/search?q=&category=&region=` | Ranked search (name → Japanese name → region → description) |
| `GET /api/place/<name>` | One place, or `Place not found!` with 404 |
| `GET /api/random` | A random place |
| `GET /api/status` | Which data source is live |
