"""Regression suite pinning real HTTP-status-contract bugs found and fixed
during Milestone 3 code review of teammates' PRs (admin-dashboard,
admin-shop, admin-event branches). Each case locks in the correct status
code for a scenario that, in an earlier commit, returned the wrong one.

Run with: pytest tests/integration/test_api_status_regressions.py -q -s
Requires a live database connection (DATABASE_URL) - these hit the real
Neon Postgres instance, not the in-memory fake_db_store fixture.
"""
import uuid

from fastapi.testclient import TestClient

from database import pool
from main import app

client = TestClient(app)

# Real heritage_sites row known to have an FK-referencing heritage_site_themes
# row. The DELETE is refused by Postgres's own FK constraint before any row
# is actually removed, so re-running this case is always safe.
FK_REFERENCED_SITE_ID = "1a8445b2-b6ab-44f9-af1f-cc45bfbf0dc3"


def _admin_token() -> str:
    email = f"regression-{uuid.uuid4().hex[:10]}@example.com"
    signup = client.post(
        "/auth/signup",
        json={"email": email, "password": "regression-probe-pw", "full_name": "Regression Probe"},
    )
    user_id = signup.json()["id"]

    # Routes probed below (REG-006, REG-007) are system_admin-gated, so the
    # probe user needs the role for real - grant it directly against the
    # live DB rather than mocking, to keep this suite's "real Postgres,
    # no fakes" guarantee intact.
    conn = pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO user_roles (user_id, role) VALUES (%s, %s) "
                "ON CONFLICT DO NOTHING",
                (user_id, "system_admin"),
            )
        conn.commit()
    finally:
        pool.putconn(conn)

    login = client.post("/auth/login", json={"email": email, "password": "regression-probe-pw"})
    return login.json()["access_token"]


def test_api_status_regressions():
    token = _admin_token()
    auth_headers = {"Authorization": f"Bearer {token}"}

    cases = [
        ("REG-001", "GET", "/admin/dashboard/shop-stats", {}, None, {401}),
        ("REG-002", "GET", "/admin/dashboard/events", {}, None, {401}),
        ("REG-003", "GET", "/admin/dashboard/recent-volunteers", {}, None, {401}),
        ("REG-004", "GET", "/admin/heritage-submissions", {}, None, {401}),
        ("REG-005", "GET", "/shop/products/not-a-uuid", {}, None, {422}),
        (
            "REG-006",
            "PATCH",
            "/events/admin/not-a-uuid",
            auth_headers,
            {"title": "Regression Probe"},
            {422},
        ),
        (
            "REG-007",
            "DELETE",
            f"/admin/heritage-submissions/{FK_REFERENCED_SITE_ID}",
            auth_headers,
            None,
            {409},
        ),
    ]

    print(f"collected {len(cases)} cases")

    failures = []
    for case_id, method, path, headers, body, expected in cases:
        kwargs = {"headers": headers}
        if body is not None:
            kwargs["json"] = body
        try:
            response = client.request(method, path, **kwargs)
            actual = response.status_code
        except Exception:
            # TestClient re-raises unhandled server exceptions instead of
            # returning a Response; in production this is exactly what
            # Starlette's exception middleware converts into a 500.
            actual = 500

        ok = actual in expected
        tag = "PASS" if ok else "FAIL"
        print(f"[{tag}] {case_id} | exp {sorted(expected)} | act {actual} | {method} {path}")
        if not ok:
            failures.append(case_id)

    passed = len(cases) - len(failures)
    print(f"summary: {len(failures)} failed, {passed} passed")

    assert not failures, f"status-contract regressions reintroduced: {failures}"
