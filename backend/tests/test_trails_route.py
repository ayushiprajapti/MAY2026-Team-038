from fastapi.testclient import TestClient


def test_get_dynamic_trails_is_public_and_returns_trails_shape(client: TestClient) -> None:
    """Route-level test only - trails_service.get_dynamic_trails() itself
    already has thorough unit coverage in tests/test_trails_service.py.
    The fake_db_store's FakeCursor answers any ST_ClusterDBSCAN query with
    an empty result set, so this just proves the route wires the service
    call into the documented {"trails": [...]} response shape without
    requiring authentication."""
    response = client.get("/trails/dynamic")

    assert response.status_code == 200
    body = response.json()
    assert body == {"trails": []}
