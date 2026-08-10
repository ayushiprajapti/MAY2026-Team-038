import re
from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient

from database import get_db
from main import app
from utils.cache import clear_all as _clear_all_caches


@pytest.fixture(autouse=True)
def _reset_service_caches():
    # Service-layer @cached functions live in a module-level dict that
    # persists across the whole pytest session, but fake_db_store resets
    # per test - without this, a cached result from one test's fake data
    # leaks into the next test that hits the same cache key.
    _clear_all_caches()
    yield


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
            # auth_service.create_user: (id, email, password_hash, full_name, phone)
            user_id, email, password_hash, full_name, phone = params
            self.store["users"].append(
                {
                    "id": user_id,
                    "email": email,
                    "password_hash": password_hash,
                    "full_name": full_name,
                    "phone": phone,
                    "is_active": True,
                }
            )
            self._result = {"id": user_id, "email": email, "full_name": full_name, "phone": phone}

        elif q.startswith("insert into user_roles"):
            user_id, role = params
            self.store["user_roles"].append({"user_id": user_id, "role": role})
            self._result = None

        elif q.startswith(
            "select id, email, full_name, phone, password_hash, is_active from users where email"
        ):
            # auth_service.authenticate_user — column order changed: phone before password_hash
            email = params[0]
            match = next((u for u in self.store["users"] if u["email"] == email), None)
            self._result = dict(match) if match else None

        elif q.startswith("select id, email, full_name, phone, is_active from users where id"):
            # auth_service.get_user_by_id — now includes phone and is_active
            user_id = params[0]
            match = next((u for u in self.store["users"] if u["id"] == user_id), None)
            self._result = (
                {
                    "id": match["id"],
                    "email": match["email"],
                    "full_name": match["full_name"],
                    "phone": match.get("phone"),
                    "is_active": match.get("is_active", True),
                }
                if match
                else None
            )

        elif q.startswith("select role from user_roles where user_id"):
            # auth_service.get_user_roles() uses a plain conn.cursor() (not
            # RealDictCursor) and indexes rows positionally (row[0]) - a
            # real psycopg2 plain cursor returns tuples, so this must too.
            user_id = params[0]
            self._results = [
                (r["role"],)
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
            # create_event — INSERT (12 params: id, title, description, event_type,
            #                        site_id, venue, event_date, start_time, end_time,
            #                        participant_limit, registration_deadline, coordinator_id)
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

        elif q.startswith("select id, event_date, registration_deadline,"):
            # register_for_event — locks and reads eligibility fields
            event_id = str(params[0])
            match = next(
                (e for e in self.store.get("events", []) if str(e["id"]) == event_id),
                None,
            )
            self._result = dict(match) if match else None
            self._results = []

        elif (
            q.startswith("select id from event_registrations where event_id")
            and "user_id = %s" in q
        ):
            event_id, user_id = map(str, params)
            match = next(
                (
                    r for r in self.store.get("event_registrations", [])
                    if str(r["event_id"]) == event_id and str(r["user_id"]) == user_id
                ),
                None,
            )
            self._result = {"id": match["id"]} if match else None
            self._results = []

        elif q.startswith("select id, status from event_registrations"):
            event_id, user_id = map(str, params)
            match = next(
                (
                    r for r in self.store.get("event_registrations", [])
                    if str(r["event_id"]) == event_id
                    and str(r["user_id"]) == user_id
                    and r.get("status") in ("confirmed", "waitlisted")
                ),
                None,
            )
            self._result = {"id": match["id"], "status": match["status"]} if match else None
            self._results = []

        elif q.startswith("update event_registrations set status = 'cancelled'"):
            registration_id = str(params[0])
            for registration in self.store.get("event_registrations", []):
                if str(registration["id"]) == registration_id:
                    registration["status"] = "cancelled"
                    break
            self._result = None
            self._results = []

        elif q.startswith("select id from event_registrations where event_id = %s and status = 'waitlisted'"):
            event_id = str(params[0])
            waitlisted = [
                r for r in self.store.get("event_registrations", [])
                if str(r["event_id"]) == event_id and r.get("status") == "waitlisted"
            ]
            waitlisted.sort(key=lambda r: r.get("registered_at", ""))
            self._result = {"id": waitlisted[0]["id"]} if waitlisted else None
            self._results = []

        elif q.startswith("update event_registrations set status = 'confirmed'"):
            registration_id = str(params[0])
            for registration in self.store.get("event_registrations", []):
                if str(registration["id"]) == registration_id:
                    registration["status"] = "confirmed"
                    break
            self._result = None
            self._results = []

        elif q.startswith("select coalesce(sum(attendee_count), 0) as attendee_count"):
            event_id = str(params[0])
            self._result = {
                "attendee_count": sum(
                    r.get("attendee_count", 1)
                    for r in self.store.get("event_registrations", [])
                    if str(r["event_id"]) == event_id
                    and r.get("status") == "confirmed"
                )
            }
            self._results = []

        elif q.startswith("insert into event_registrations ( id, event_id, user_id, status, first_name,"):
            (
                registration_id, event_id, user_id, registration_status, first_name,
                last_name, email, phone, attendee_count, note, receive_event_updates,
            ) = params
            registration = {
                "id": registration_id,
                "event_id": event_id,
                "user_id": user_id,
                "status": registration_status,
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "phone": phone,
                "attendee_count": attendee_count,
                "note": note,
                "receive_event_updates": receive_event_updates,
                "registered_at": datetime.now(timezone.utc),
            }
            self.store.setdefault("event_registrations", []).append(registration)
            self._result = {
                "registration_id": registration_id,
                "event_id": event_id,
                "user_id": user_id,
                "registration_status": registration_status,
                "registered_at": registration["registered_at"],
                "attendee_count": attendee_count,
            }
            self._results = []

        elif q.startswith("select er.id as registration_id,") and "event_status" in q:
            # list_user_event_history — a user's registrations joined with events
            user_id = str(params[0])
            history = []
            for registration in self.store.get("event_registrations", []):
                if str(registration.get("user_id")) != user_id:
                    continue
                event = next(
                    (
                        item for item in self.store.get("events", [])
                        if str(item["id"]) == str(registration["event_id"])
                    ),
                    None,
                )
                if event is None:
                    continue
                registration_status = registration["status"]
                if registration_status == "cancelled":
                    history_status = "revoked"
                elif event["status"] == "completed" and registration_status == "confirmed":
                    history_status = "attended"
                elif registration_status == "waitlisted":
                    history_status = "waitlisted"
                else:
                    history_status = "registered"
                history.append(
                    {
                        "registration_id": registration["id"],
                        "registration_status": registration_status,
                        "history_status": history_status,
                        "registered_at": registration.get("registered_at"),
                        "attendee_count": registration.get("attendee_count", 1),
                        "first_name": registration.get("first_name", "Visitor"),
                        "last_name": registration.get("last_name", ""),
                        "event_id": event["id"],
                        "title": event["title"],
                        "description": event.get("description"),
                        "event_type": event["event_type"],
                        "venue": event.get("venue"),
                        "event_date": event["event_date"],
                        "start_time": event["start_time"],
                        "end_time": event.get("end_time"),
                        "event_status": event["status"],
                    }
                )
            self._results = history
            self._result = None

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
