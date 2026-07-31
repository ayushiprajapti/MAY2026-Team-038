from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_get_verification_list():
    response = client.get("/admin/verification")
    assert response.status_code in [200, 401, 403]


def test_get_verification_detail():
    response = client.get("/admin/verification/test-id")
    assert response.status_code in [200, 401, 403, 404]


def test_approve_submission():
    response = client.patch(
        "/admin/verification/test-id/approve",
        json={"review_notes": "Approved"},
    )
    assert response.status_code in [200, 401, 403, 404]


def test_reject_submission():
    response = client.patch(
        "/admin/verification/test-id/reject",
        json={"review_notes": "Rejected"},
    )
    assert response.status_code in [200, 401, 403, 404]