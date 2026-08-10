"""In-process TTL cache for read-heavy service functions. No redis - a
single dict is fine at current scale (single FastAPI process, admin-only
traffic). Cache resets on process restart/deploy, which is acceptable."""

import time
from functools import wraps
from typing import Any, Callable

_store: dict[tuple, tuple[Any, float]] = {}
_time_fn: Callable[[], float] = time.monotonic


def clear_all() -> None:
    """Wipes every cached function's entries, regardless of which cached()
    call created them. Intended for test isolation (an autouse fixture
    calling this before each test) - the module-level _store otherwise
    persists across the whole pytest session even though per-test fixtures
    like a fake DB store reset every time."""
    _store.clear()


def _key(func: Callable, args: tuple, kwargs: dict) -> tuple:
    # args[0] is always the DB connection for our service functions - never
    # part of the key, since two different connections should hit the same
    # cached result for identical query params.
    return (
        func.__module__,
        func.__qualname__,
        args[1:],
        tuple(sorted(kwargs.items())),
    )


def cached(ttl_seconds: float) -> Callable:
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            key = _key(func, args, kwargs)
            now = _time_fn()

            cached_entry = _store.get(key)
            if cached_entry is not None:
                value, expires_at = cached_entry
                if now < expires_at:
                    return value

            value = func(*args, **kwargs)
            _store[key] = (value, now + ttl_seconds)
            return value

        def cache_clear() -> None:
            prefix = (func.__module__, func.__qualname__)
            for key in [k for k in _store if k[:2] == prefix]:
                del _store[key]

        def is_cached(*rest_args: Any, **kwargs: Any) -> bool:
            # rest_args excludes the connection - callers pass the same
            # trailing args/kwargs they'd call the function with, minus conn.
            key = (func.__module__, func.__qualname__, rest_args, tuple(sorted(kwargs.items())))
            entry = _store.get(key)
            if entry is None:
                return False
            _, expires_at = entry
            return _time_fn() < expires_at

        wrapper.cache_clear = cache_clear
        wrapper.is_cached = is_cached
        return wrapper

    return decorator
