import utils.cache as cache_mod
from utils.cache import cached


def setup_function():
    cache_mod._store.clear()
    cache_mod._time_fn = lambda: 0.0


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

    @cached(ttl_seconds=10)
    def fn(conn, x):
        calls.append(x)
        return x

    fn("conn-a", 1)
    cache_mod._time_fn = lambda: 5.0
    fn("conn-a", 1)  # still within TTL
    cache_mod._time_fn = lambda: 11.0
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


def test_is_cached_reflects_state():
    @cached(ttl_seconds=10)
    def fn(conn, x):
        return x

    assert fn.is_cached(1) is False
    fn("conn-a", 1)
    assert fn.is_cached(1) is True
    assert fn.is_cached(2) is False

    cache_mod._time_fn = lambda: 11.0
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
