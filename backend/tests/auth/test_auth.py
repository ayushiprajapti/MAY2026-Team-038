from fastapi.testclient import TestClient

SIGNUP_PAYLOAD = {
    "email": "user@example.com",
    "password": "supersecret",
    "full_name": "Test User",
}


def test_signup_creates_user(client: TestClient) -> None:
    response = client.post("/auth/signup", json=SIGNUP_PAYLOAD)

    assert response.status_code == 201
    body = response.json()
    assert body["email"] == SIGNUP_PAYLOAD["email"]
    assert body["full_name"] == SIGNUP_PAYLOAD["full_name"]
    assert "id" in body


def test_signup_duplicate_email_is_rejected(client: TestClient) -> None:
    client.post("/auth/signup", json=SIGNUP_PAYLOAD)

    response = client.post("/auth/signup", json=SIGNUP_PAYLOAD)

    assert response.status_code == 409


def test_signup_short_password_is_rejected(client: TestClient) -> None:
    response = client.post(
        "/auth/signup",
        json={"email": "short@example.com", "password": "short", "full_name": "Short"},
    )

    assert response.status_code == 422


def test_login_with_correct_credentials_returns_token(client: TestClient) -> None:
    client.post("/auth/signup", json=SIGNUP_PAYLOAD)

    response = client.post(
        "/auth/login",
        json={"email": SIGNUP_PAYLOAD["email"], "password": SIGNUP_PAYLOAD["password"]},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


def test_login_with_wrong_password_is_rejected(client: TestClient) -> None:
    client.post("/auth/signup", json=SIGNUP_PAYLOAD)

    response = client.post(
        "/auth/login",
        json={"email": SIGNUP_PAYLOAD["email"], "password": "wrong-password"},
    )

    assert response.status_code == 401


def test_login_with_unknown_email_is_rejected(client: TestClient) -> None:
    response = client.post(
        "/auth/login", json={"email": "nobody@example.com", "password": "whatever"}
    )

    assert response.status_code == 401


def test_me_without_token_is_rejected(client: TestClient) -> None:
    response = client.get("/auth/me")

    assert response.status_code == 401


def test_me_with_valid_token_returns_current_user(client: TestClient) -> None:
    client.post("/auth/signup", json=SIGNUP_PAYLOAD)
    login_response = client.post(
        "/auth/login",
        json={"email": SIGNUP_PAYLOAD["email"], "password": SIGNUP_PAYLOAD["password"]},
    )
    token = login_response.json()["access_token"]

    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json()["email"] == SIGNUP_PAYLOAD["email"]


def test_me_with_invalid_token_is_rejected(client: TestClient) -> None:
    response = client.get("/auth/me", headers={"Authorization": "Bearer not-a-real-token"})

    assert response.status_code == 401


def test_login_is_case_insensitive_for_email(client: TestClient) -> None:
    """Regression test for the login bug: a user who signs up with a
    mixed-case email must still be able to log in when they type their
    email with different casing - previously this raised a bogus 401
    because signup/login compared emails case-sensitively."""
    client.post(
        "/auth/signup",
        json={
            "email": "MixedCase@Example.com",
            "password": SIGNUP_PAYLOAD["password"],
            "full_name": "Mixed Case",
        },
    )

    response = client.post(
        "/auth/login",
        json={"email": "mixedcase@example.com", "password": SIGNUP_PAYLOAD["password"]},
    )

    assert response.status_code == 200
    assert response.json()["access_token"]


def test_signup_rejects_duplicate_email_regardless_of_case(client: TestClient) -> None:
    client.post("/auth/signup", json=SIGNUP_PAYLOAD)

    response = client.post(
        "/auth/signup",
        json={
            "email": SIGNUP_PAYLOAD["email"].upper(),
            "password": SIGNUP_PAYLOAD["password"],
            "full_name": "Duplicate",
        },
    )

    assert response.status_code == 409


def _login(client: TestClient) -> str:
    client.post("/auth/signup", json=SIGNUP_PAYLOAD)
    login_response = client.post(
        "/auth/login",
        json={"email": SIGNUP_PAYLOAD["email"], "password": SIGNUP_PAYLOAD["password"]},
    )
    return login_response.json()["access_token"]


def test_update_me_without_token_is_rejected(client: TestClient) -> None:
    response = client.patch("/auth/me", json={"full_name": "New Name"})

    assert response.status_code == 401


def test_update_me_updates_full_name_and_phone(client: TestClient) -> None:
    token = _login(client)

    response = client.patch(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
        json={"full_name": "Updated Name", "phone": "9999999999"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["full_name"] == "Updated Name"
    assert body["phone"] == "9999999999"
    assert body["email"] == SIGNUP_PAYLOAD["email"]


def test_update_me_with_no_fields_returns_unchanged_profile(client: TestClient) -> None:
    token = _login(client)

    response = client.patch(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
        json={},
    )

    assert response.status_code == 200
    assert response.json()["full_name"] == SIGNUP_PAYLOAD["full_name"]
