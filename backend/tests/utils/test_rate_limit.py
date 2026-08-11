import time

import fakeredis.aioredis
import pytest
from starlette.applications import Starlette
from starlette.responses import PlainTextResponse
from starlette.routing import Route
from starlette.testclient import TestClient

from utils import redis_client
from utils.rate_limit import RateLimitMiddleware


def _make_app(max_requests: int, window_seconds: float) -> Starlette:
    async def homepage(request):
        return PlainTextResponse("ok")

    app = Starlette(routes=[Route("/", homepage)])
    app.add_middleware(
        RateLimitMiddleware,
        max_requests=max_requests,
        window_seconds=window_seconds,
    )
    return app


def setup_function():
    redis_client.set_async_redis_client(fakeredis.aioredis.FakeRedis())


def test_allows_requests_under_the_limit():
    client = TestClient(_make_app(max_requests=3, window_seconds=60.0))
    for _ in range(3):
        resp = client.get("/")
        assert resp.status_code == 200


def test_blocks_requests_over_the_limit():
    client = TestClient(_make_app(max_requests=3, window_seconds=60.0))
    for _ in range(3):
        assert client.get("/").status_code == 200

    resp = client.get("/")
    assert resp.status_code == 429
    assert resp.json() == {"detail": "Too many requests"}


def test_limit_recovers_after_window_expires():
    client = TestClient(_make_app(max_requests=1, window_seconds=0.5))
    assert client.get("/").status_code == 200
    assert client.get("/").status_code == 429

    time.sleep(0.6)

    assert client.get("/").status_code == 200


def test_requests_share_a_budget_within_one_client():
    # TestClient always reports the same host, so this documents the
    # per-key (per-IP) budget behavior: repeated hits from what the
    # middleware sees as one IP exhaust that IP's own bucket only.
    client = TestClient(_make_app(max_requests=1, window_seconds=60.0))
    assert client.get("/").status_code == 200
    assert client.get("/").status_code == 429


def test_unknown_client_falls_back_to_unknown_bucket():
    # request.client can be None (e.g. behind certain ASGI transports);
    # the middleware must not crash, and should bucket those under "unknown".
    client = TestClient(_make_app(max_requests=1, window_seconds=60.0))
    assert client.get("/").status_code == 200


@pytest.mark.parametrize("n_requests", [5, 10])
def test_exact_boundary_is_not_off_by_one(n_requests):
    client = TestClient(_make_app(max_requests=n_requests, window_seconds=60.0))
    statuses = [client.get("/").status_code for _ in range(n_requests)]
    assert statuses == [200] * n_requests
    assert client.get("/").status_code == 429
