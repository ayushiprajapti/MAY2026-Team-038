import time

import fakeredis

from utils import redis_client
from utils.cache import cached


def setup_function():
    redis_client.set_redis_client(fakeredis.FakeRedis())


def test_caches_result_for_identical_args():
    calls = []

    @cached(ttl_seconds=60)
    def fn(conn, x):
        calls.append(x)
        return x * 2

    assert fn("conn-a", 5) == 10
    assert fn("conn-b", 5) == 10  # different conn, same x -> cache hit
    assert calls == [5]


def test_different_args_are_different_cache_entries():
    calls = []

    @cached(ttl_seconds=60)
    def fn(conn, x):
        calls.append(x)
        return x * 2

    fn("conn-a", 5)
    fn("conn-a", 7)
    assert calls == [5, 7]


def test_expires_after_ttl():
    calls = []

    @cached(ttl_seconds=1)
    def fn(conn, x):
        calls.append(x)
        return x

    fn("conn-a", 1)
    fn("conn-a", 1)  # still within TTL
    assert calls == [1]

    time.sleep(1.1)
    fn("conn-a", 1)  # expired -> recompute
    assert calls == [1, 1]


def test_cache_clear_forces_recompute():
    calls = []

    @cached(ttl_seconds=60)
    def fn(conn, x):
        calls.append(x)
        return x

    fn("conn-a", 1)
    fn.cache_clear()
    fn("conn-a", 1)
    assert calls == [1, 1]


def test_cache_clear_only_clears_own_function():
    calls_a, calls_b = [], []

    @cached(ttl_seconds=60)
    def fn_a(conn, x):
        calls_a.append(x)
        return x

    @cached(ttl_seconds=60)
    def fn_b(conn, x):
        calls_b.append(x)
        return x

    fn_a("conn-a", 1)
    fn_b("conn-a", 1)
    fn_a.cache_clear()

    fn_a("conn-a", 1)  # recomputed
    fn_b("conn-a", 1)  # still cached

    assert calls_a == [1, 1]
    assert calls_b == [1]


def test_is_cached_reflects_state():
    @cached(ttl_seconds=10)
    def fn(conn, x):
        return x

    assert fn.is_cached(1) is False
    fn("conn-a", 1)
    assert fn.is_cached(1) is True
    assert fn.is_cached(2) is False


def test_is_cached_false_after_ttl_expiry():
    @cached(ttl_seconds=1)
    def fn(conn, x):
        return x

    fn("conn-a", 1)
    assert fn.is_cached(1) is True
    time.sleep(1.1)
    assert fn.is_cached(1) is False


def test_kwargs_are_part_of_the_key():
    calls = []

    @cached(ttl_seconds=60)
    def fn(conn, category=None):
        calls.append(category)
        return category

    fn("conn-a", category="built")
    fn("conn-a", category="natural")
    fn("conn-a", category="built")
    assert calls == ["built", "natural"]


def test_cached_value_round_trips_complex_objects():
    # Regression guard: cache must survive pickling non-trivial return types
    # (services return Pydantic models / lists of dicts, not just scalars).
    @cached(ttl_seconds=60)
    def fn(conn):
        return {"a": [1, 2, {"nested": True}], "b": None}

    first = fn("conn-a")
    second = fn("conn-a")
    assert first == second == {"a": [1, 2, {"nested": True}], "b": None}
