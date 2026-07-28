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
