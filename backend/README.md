# Backend

FastAPI backend for the INTACH Pune platform.

## Structure

```
backend/
  routes/       # API endpoints (health.py, auth.py)
  services/     # business logic (auth_service.py)
  utils/        # helpers
    security.py #   password hashing + JWT create/decode
    auth.py     #   get_current_user — Depends() wrapper to protect any route
  schemas/      # Pydantic request/response models (auth.py)
  config.py     # settings loaded from .env
  database.py   # psycopg2 connection pool against the cloud-hosted Postgres
  main.py       # FastAPI app entrypoint
  tests/        # pytest suite (one test file per route module)
  requirements.txt # includes pytest + httpx for running tests
  pytest.ini
  .env.example
```

No ORM/`models/` folder — this talks to Postgres directly via `psycopg2`
(cloud-hosted instance, no local DB assumed), so query results are plain
dict rows rather than mapped model classes.

## Setup

```bash
cd backend
python3.13 -m venv venv  # use 3.13, not 3.14 — some deps don't have 3.14 wheels yet
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill in DATABASE_URL with your cloud Postgres connection string
uvicorn main:app --reload
```

API will be available at `http://localhost:8000`, docs at `http://localhost:8000/docs`.

## Database schema

`db/create_schema.py` is a Python script (not raw `.sql` files) that creates
every table/enum/extension from `../schema.dbml` against `DATABASE_URL`.
Run it once, against a fresh database, after `.env` is filled in:

```bash
python -m db.create_schema
```

It's a one-time bootstrap, not a migration tool — see the module docstring
in `db/create_schema.py` for details, and `CONTRIBUTING.md` for why this
file is locked from casual edits.

## Tests

```bash
pytest -v
```

Tests hit each route through FastAPI's `TestClient` with the real `get_db`
dependency swapped for an in-memory fake (`tests/conftest.py`) — no real
Postgres connection needed to run the suite. Add a `test_<resource>.py` file
per new route module as routes are built out.

## Auth

JWT-based auth against a `users` table (`id, email, password_hash, full_name`
assumed — adjust `services/auth_service.py` if your schema differs):

- `POST /auth/signup` — `{ "email", "password", "full_name" }` → creates the user
- `POST /auth/login` — `{ "email", "password" }` → `{ "access_token", "token_type" }`
- `GET /auth/me` — send `Authorization: Bearer <token>` → returns the current user

Passwords are hashed with bcrypt (`passlib`); tokens are signed HS256 JWTs
(`python-jose`) using `SECRET_KEY` from `.env`, expiring after
`ACCESS_TOKEN_EXPIRE_MINUTES` (default 24h).

To protect any new route, add `utils.auth.get_current_user` as a dependency:

```python
from fastapi import Depends
from utils.auth import get_current_user

@router.post("/events/{event_id}/register")
def register_for_event(event_id: str, current_user: dict = Depends(get_current_user)):
    ...  # current_user["id"] is the authenticated user's uuid
```
