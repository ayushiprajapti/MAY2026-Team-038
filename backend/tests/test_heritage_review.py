from fastapi.testclient import TestClient

from main import app
from utils.auth import get_current_user

client = TestClient(app)

# Any syntactically-valid UUID; these tests only exercise the auth gate, so
# no request here should ever reach the database.
SUBMISSION_ID = "00000000-0000-0000-0000-000000000000"


def test_get_all_pending_requires_auth():
    response = client.get("/admin/heritage-submissions")
    assert response.status_code == 401


def test_get_one_submission_requires_auth():
    response = client.get(f"/admin/heritage-submissions/{SUBMISSION_ID}")
    assert response.status_code == 401


def test_approve_requires_auth():
    response = client.patch(
        f"/admin/heritage-submissions/{SUBMISSION_ID}/approve",
        json={"review_notes": "Approved"},
    )
    assert response.status_code == 401


def test_reject_requires_auth():
    response = client.patch(
        f"/admin/heritage-submissions/{SUBMISSION_ID}/reject",
        json={"review_notes": "Rejected"},
    )
    assert response.status_code == 401


def test_delete_requires_auth():
    response = client.delete(f"/admin/heritage-submissions/{SUBMISSION_ID}")
    assert response.status_code == 401


def test_get_one_submission_rejects_malformed_id_when_authenticated():
    # Bypass auth via dependency_overrides (no real token/DB user needed) to
    # prove the route's UUID-typed path param rejects a malformed id with a
    # clean 422 instead of it reaching the database.
    app.dependency_overrides[get_current_user] = lambda: {"id": SUBMISSION_ID}
    try:
        response = client.get("/admin/heritage-submissions/not-a-uuid")
    finally:
        app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 422
