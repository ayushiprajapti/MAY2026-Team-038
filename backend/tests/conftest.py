import re

import pytest
from fastapi.testclient import TestClient

from database import get_db
from main import app


class FakeCursor:
    """Pattern-matches the exact queries used in services/auth_service.py
    against an in-memory store, so tests never touch the real Postgres."""

    def __init__(self, store: dict):
        self.store = store
        self._result = None
        self._results: list = []  # for fetchall()

    def __enter__(self) -> "FakeCursor":
        return self

    def __exit__(self, exc_type, exc, tb) -> bool:
        return False

    def execute(self, query: str, params: tuple = ()) -> None:
        q = " ".join(query.split()).lower()

        if q.startswith("select id from users where email"):
            email = params[0]
            match = next((u for u in self.store["users"] if u["email"] == email), None)
            self._result = {"id": match["id"]} if match else None

        elif q.startswith("insert into users"):
            user_id, email, password_hash, full_name = params
            self.store["users"].append(
                {
                    "id": user_id,
                    "email": email,
                    "password_hash": password_hash,
                    "full_name": full_name,
                    "is_active": True,
                }
            )
            self._result = {"id": user_id, "email": email, "full_name": full_name}

        elif q.startswith("insert into user_roles"):
            user_id, role = params
            self.store["user_roles"].append({"user_id": user_id, "role": role})
            self._result = None

        elif q.startswith(
            "select id, email, full_name, password_hash, is_active from users where email"
        ):
            email = params[0]
            match = next((u for u in self.store["users"] if u["email"] == email), None)
            self._result = dict(match) if match else None

        elif q.startswith("select id, email, full_name from users where id"):
            user_id = params[0]
            match = next((u for u in self.store["users"] if u["id"] == user_id), None)
            self._result = (
                {"id": match["id"], "email": match["email"], "full_name": match["full_name"]}
                if match
                else None
            )

        elif q.startswith("select role from user_roles where user_id"):
            user_id = params[0]
            self._results = [
                {"role": r["role"]}
                for r in self.store.get("user_roles", [])
                if r["user_id"] == user_id
            ]
            self._result = None

        # ── event service queries (added; existing patterns above are unchanged) ──

        elif q.startswith("select e.id, e.title,"):
            # list_all_events — event rows
            self._results = [dict(e) for e in self.store.get("events", [])]
            self._result = None

        elif q.startswith("select count(*) filter ( where status = 'published'"):
            # list_all_events — dashboard stat cards
            import datetime as _dt
            today = str(_dt.date.today())
            events = self.store.get("events", [])
            regs = self.store.get("event_registrations", [])
            self._result = {
                "upcoming_events": sum(
                    1 for e in events
                    if e.get("status") == "published"
                    and str(e.get("event_date", "")) >= today
                ),
                "completed_events": sum(
                    1 for e in events if e.get("status") == "completed"
                ),
                "total_registrations": sum(
                    1 for r in regs
                    if r.get("status") in ("confirmed", "waitlisted")
                ),
            }
            self._results = []

        elif q.startswith("insert into events ( id, title,"):
            # create_event — INSERT
            (
                event_id, title, description, event_type, site_id, venue,
                event_date, start_time, end_time, participant_limit,
                registration_deadline, coordinator_id,
            ) = params
            new_event = {
                "id": event_id,
                "title": title,
                "description": description,
                "event_type": event_type,
                "site_id": site_id,
                "venue": venue,
                "event_date": event_date,
                "start_time": start_time,
                "end_time": end_time,
                "participant_limit": participant_limit,
                "registration_deadline": registration_deadline,
                "coordinator_id": coordinator_id,
                "status": "published",
            }
            self.store.setdefault("events", []).append(new_event)
            self._result = dict(new_event)
            self._results = []

        elif q.startswith("update events set"):
            # update_event — dynamic PATCH; infer columns from the SET clause
            set_part = q.split("where")[0].split("set")[1]
            cols = re.findall(r"(\w+) = %s", set_part)
            event_id = str(params[-1])
            match = next(
                (e for e in self.store.get("events", []) if str(e["id"]) == event_id),
                None,
            )
            if match is None:
                self._result = None
            else:
                for col, val in zip(cols, params[:-1]):
                    match[col] = val
                self._result = dict(match)
            self._results = []

        elif q.startswith("select count(id) filter"):
            # update_event — re-fetch live registration count
            event_id = str(params[0])
            count = sum(
                1 for r in self.store.get("event_registrations", [])
                if str(r.get("event_id")) == event_id
                and r.get("status") in ("confirmed", "waitlisted")
            )
            self._result = {"registration_count": count}
            self._results = []

        elif q.startswith("select id from events where id"):
            # delete_event — existence check
            event_id = str(params[0])
            match = next(
                (e for e in self.store.get("events", []) if str(e["id"]) == event_id),
                None,
            )
            self._result = {"id": event_id} if match else None
            self._results = []

        elif q.startswith("delete from event_registrations where event_id"):
            # delete_event — cascade-delete child registration rows
            event_id = str(params[0])
            self.store["event_registrations"] = [
                r for r in self.store.get("event_registrations", [])
                if str(r.get("event_id")) != event_id
            ]
            self._result = None
            self._results = []

        elif q.startswith("delete from events where id"):
            # delete_event — remove the event row itself
            event_id = str(params[0])
            self.store["events"] = [
                e for e in self.store.get("events", []) if str(e["id"]) != event_id
            ]
            self._result = None
            self._results = []

        elif q.startswith("select id, title, event_date,"):
            # list_event_registrants — event header
            event_id = str(params[0])
            match = next(
                (e for e in self.store.get("events", []) if str(e["id"]) == event_id),
                None,
            )
            self._result = dict(match) if match else None
            self._results = []

        elif q.startswith("select er.id as registration_id,"):
            # list_event_registrants — attendee rows joined with users
            event_id = str(params[0])
            attendees = []
            for r in self.store.get("event_registrations", []):
                if str(r.get("event_id")) != event_id:
                    continue
                if r.get("status") not in ("confirmed", "waitlisted"):
                    continue
                user = next(
                    (
                        u for u in self.store.get("users", [])
                        if str(u["id"]) == str(r["user_id"])
                    ),
                    None,
                )
                if user:
                    attendees.append({
                        "registration_id": r["id"],
                        "user_id": r["user_id"],
                        "registration_status": r["status"],
                        "registered_at": r.get("registered_at"),
                        "full_name": user["full_name"],
                        "email": user["email"],
                        "phone": user.get("phone"),
                    })
            self._results = attendees
            self._result = None

        else:
            raise NotImplementedError(f"Unhandled query in FakeCursor: {query}")

    def fetchone(self) -> dict | None:
        return self._result

    def fetchall(self) -> list:
        return self._results


class FakeConnection:
    def __init__(self, store: dict):
        self.store = store

    def cursor(self, cursor_factory=None) -> FakeCursor:
        return FakeCursor(self.store)

    def commit(self) -> None:
        pass

    def rollback(self) -> None:
        pass


@pytest.fixture
def fake_db_store() -> dict:
    return {"users": [], "user_roles": [], "events": [], "event_registrations": []}


@pytest.fixture
def client(fake_db_store: dict) -> TestClient:
    def _get_db_override():
        yield FakeConnection(fake_db_store)

    app.dependency_overrides[get_db] = _get_db_override
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
