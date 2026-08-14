# Backend

FastAPI backend for the INTACH Pune heritage platform — see the [root README](../README.md) for what the platform does as a whole.

## Tech stack

- **FastAPI** + **Uvicorn** — API framework and ASGI server
- **PostgreSQL + PostGIS**, via `psycopg2` directly — no ORM, no `models/` folder; query results are plain dict rows
- **Redis** — shared query cache (`utils/cache.py`), rate limiting
- **Cloudinary** — image storage (shop products, monuments, events, heritage submissions)
- **NVIDIA-hosted LLM API** — RAG heritage chatbot (`rag/`) and content generation
- **JWT auth** (`python-jose` + `passlib`/bcrypt)

## Startup

### 1. Prerequisites

- Python **3.13** (not 3.14 — some dependencies don't have 3.14 wheels yet)
- A PostgreSQL database with the **PostGIS** extension available (a cloud instance like [Neon](https://neon.tech) works fine — no local Postgres install assumed)
- A **Redis** instance (local `redis-server`, or any hosted Redis)
- A **Cloudinary** account (cloud name + API key/secret, free tier is enough)
- An **NVIDIA API** key ([build.nvidia.com](https://build.nvidia.com)) for the chatbot and content-generation features

### 2. Install dependencies

```bash
cd backend
python3.13 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `SECRET_KEY` | JWT signing secret — any random string in dev |
| `CORS_ORIGINS` | Comma-separated frontend origin(s), e.g. `http://localhost:5173` |
| `NVIDIA_API_KEY` | Chatbot + content-generation LLM calls |
| `REDIS_URL` | e.g. `redis://localhost:6379/0` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Image uploads |

### 4. Create the database schema

`db/create_schema.py` is a one-time bootstrap script (not a migration tool) that creates every table/enum/extension against `DATABASE_URL`, matching `../schema.dbml`. Run it once against a fresh database:

```bash
python -m db.create_schema
```

Later schema changes ship as their own one-off scripts in `db/` (e.g. `db/migrate_event_image_url.py`) — see existing `db/migrate_*.py` files for the pattern. Keep `schema.dbml` in sync whenever you add or change a column; it's documentation only and isn't auto-generated.

### 5. Run the server

```bash
uvicorn main:app --reload
```

API: `http://localhost:8000` — interactive docs: `http://localhost:8000/docs`.

## Structure

```
backend/
├── main.py            FastAPI app entrypoint, router registration, static file mount
├── config.py           Settings loaded from .env (pydantic-settings)
├── database.py         psycopg2 connection pool + get_db() FastAPI dependency
├── routes/             API endpoints, one module per resource
├── services/            Business logic + SQL queries, called by routes
├── schemas/             Pydantic request/response models
├── utils/               auth.py (JWT), security.py (hashing), cache.py (Redis caching),
│                        redis_client.py, rate_limit.py
├── rag/                  RAG heritage chatbot: retrieval, chunking, LLM client
├── db/                   One-off schema/data scripts: create_schema.py, migrate_*.py, seed_*.py
├── data_sourcing/        Scripts that populate heritage_sites/products from source data
├── genai/                 AI-assisted data enrichment scripts
├── static/                Locally-served static files (legacy — new uploads go to Cloudinary)
└── tests/                 pytest suite, one file per route/service
```

## API surface

| Prefix | Covers |
|---|---|
| `/auth` | Signup, login, current user |
| `/events`, `/events/admin` | Public event listing/registration; admin event CRUD |
| `/shop`, `/shop/admin` | Public product listing/orders; admin product CRUD |
| `/trails` | Dynamically-generated heritage trails |
| `/volunteer/heritage-submissions` | Public heritage-site submission + image upload |
| `/admin/heritage-submissions` | Admin review queue (approve/reject/delete) |
| `/admin/dashboard` | Admin summary stats |
| `/chat` | RAG heritage chatbot sessions/messages |

## Caching

Read-heavy list/detail queries are cached in Redis via the `@cached(ttl_seconds=...)` decorator (`utils/cache.py`), shared across all backend processes. Any route that writes to a cached resource must call `.cache_clear()` on every affected cached function — both the admin-facing and public-facing versions where they differ (e.g. an event edit must clear both `list_all_events` and `list_upcoming_events`). Missing one is a real, easy-to-make bug — check `grep -rn cache_clear services/ routes/` before adding a new cached function.

## Tests

```bash
pytest -v
```

Tests hit each route through FastAPI's `TestClient`, with `get_db` swapped for an in-memory fake store (`tests/conftest.py`) and Redis swapped for `fakeredis` — no real Postgres or Redis connection needed to run the suite.

## Auth

JWT-based, against the `users` + `user_roles` tables:

- `POST /auth/signup` — `{ "email", "password", "full_name" }` → creates the user (default role `registered_member`)
- `POST /auth/login` — `{ "email", "password" }` → `{ "access_token", "token_type" }`
- `GET /auth/me` — `Authorization: Bearer <token>` → current user

To protect a route, add `utils.auth.get_current_user` (any authenticated user) or `utils.auth.require_roles("role_name")` (specific role) as a dependency:

```python
from fastapi import Depends
from utils.auth import get_current_user, require_roles

@router.post("/events/{event_id}/register")
def register_for_event(event_id: str, current_user: dict = Depends(get_current_user)):
    ...  # current_user["id"] is the authenticated user's uuid

@router.post("/shop/admin/products")
def create_product(current_user: dict = Depends(require_roles("shop_admin"))):
    ...
```
