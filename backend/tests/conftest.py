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

        else:
            raise NotImplementedError(f"Unhandled query in FakeCursor: {query}")

    def fetchone(self) -> dict | None:
        return self._result


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
    return {"users": [], "user_roles": []}


@pytest.fixture
def client(fake_db_store: dict) -> TestClient:
    def _get_db_override():
        yield FakeConnection(fake_db_store)

    app.dependency_overrides[get_db] = _get_db_override
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
