from datetime import datetime, timezone
from unittest.mock import patch
from uuid import uuid4

from fastapi.testclient import TestClient

from main import app
from services import volunteer_heritage_service
from utils.auth import get_current_user

client = TestClient(app)

USER_ID = str(uuid4())
SUBMISSION_ID = str(uuid4())

# Minimal valid 1x1 PNG - real magic bytes so save_submission_image()'s
# content-sniffing (not just the declared Content-Type) accepts it.
_PNG_BYTES = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0"
    b"\x00\x00\x03\x01\x01\x00\x18\xdd\x8d\xb0\x00\x00\x00\x00IEND\xaeB`\x82"
)


def _fake_submission(**overrides) -> dict:
    base = {
        "id": SUBMISSION_ID,
        "name": "Shaniwar Wada",
        "category": "built",
        "address": None,
        "construction_period": None,
        "historical_significance": None,
        "description": None,
        "image_url": None,
        "latitude": None,
        "longitude": None,
        "status": "pending_review",
        "submitted_by": USER_ID,
        "reviewed_at": None,
        "review_notes": None,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    base.update(overrides)
    return base


def _authed():
    app.dependency_overrides[get_current_user] = lambda: {"id": USER_ID}
    return app.dependency_overrides


def _clear_auth():
    app.dependency_overrides.pop(get_current_user, None)


def test_create_submission_requires_auth():
    response = client.post(
        "/volunteer/heritage-submissions",
        json={"name": "Shaniwar Wada", "category": "built"},
    )
    assert response.status_code == 401


def test_create_submission_success():
    _authed()
    try:
        with patch.object(
            volunteer_heritage_service, "create_submission", return_value=_fake_submission()
        ) as mock_create:
            response = client.post(
                "/volunteer/heritage-submissions",
                json={"name": "Shaniwar Wada", "category": "built"},
            )
    finally:
        _clear_auth()

    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Shaniwar Wada"
    assert body["status"] == "pending_review"
    mock_create.assert_called_once()


def test_create_submission_rejects_invalid_category():
    _authed()
    try:
        response = client.post(
            "/volunteer/heritage-submissions",
            json={"name": "Shaniwar Wada", "category": "not-a-real-category"},
        )
    finally:
        _clear_auth()

    assert response.status_code == 422


def test_get_my_submissions_requires_auth():
    response = client.get("/volunteer/heritage-submissions")
    assert response.status_code == 401


def test_get_my_submissions_success():
    _authed()
    try:
        with patch.object(
            volunteer_heritage_service,
            "get_my_submissions",
            return_value=[_fake_submission()],
        ):
            response = client.get("/volunteer/heritage-submissions")
    finally:
        _clear_auth()

    assert response.status_code == 200
    body = response.json()
    assert isinstance(body, list)
    assert body[0]["id"] == SUBMISSION_ID


def test_get_one_submission_requires_auth():
    response = client.get(f"/volunteer/heritage-submissions/{SUBMISSION_ID}")
    assert response.status_code == 401


def test_get_one_submission_success():
    _authed()
    try:
        with patch.object(
            volunteer_heritage_service, "get_my_submission", return_value=_fake_submission()
        ):
            response = client.get(f"/volunteer/heritage-submissions/{SUBMISSION_ID}")
    finally:
        _clear_auth()

    assert response.status_code == 200
    assert response.json()["id"] == SUBMISSION_ID


def test_get_one_submission_returns_404_when_missing():
    _authed()
    try:
        with patch.object(volunteer_heritage_service, "get_my_submission", return_value=None):
            response = client.get(f"/volunteer/heritage-submissions/{SUBMISSION_ID}")
    finally:
        _clear_auth()

    assert response.status_code == 404


def test_get_one_submission_rejects_malformed_id():
    _authed()
    try:
        response = client.get("/volunteer/heritage-submissions/not-a-uuid")
    finally:
        _clear_auth()

    assert response.status_code == 422


def test_upload_image_requires_auth():
    response = client.post(
        "/volunteer/heritage-submissions/upload-image",
        files={"file": ("site.png", _PNG_BYTES, "image/png")},
    )
    assert response.status_code == 401


def test_upload_image_success(tmp_path):
    _authed()
    try:
        with patch.object(
            volunteer_heritage_service,
            "save_submission_image",
            return_value="/static/heritage-submissions/fake.png",
        ) as mock_save:
            response = client.post(
                "/volunteer/heritage-submissions/upload-image",
                files={"file": ("site.png", _PNG_BYTES, "image/png")},
            )
    finally:
        _clear_auth()

    assert response.status_code == 201
    assert response.json()["image_url"] == "/static/heritage-submissions/fake.png"
    mock_save.assert_called_once()


def test_upload_image_rejects_disallowed_content_type():
    _authed()
    try:
        response = client.post(
            "/volunteer/heritage-submissions/upload-image",
            files={"file": ("site.txt", b"not an image", "text/plain")},
        )
    finally:
        _clear_auth()

    assert response.status_code == 400
