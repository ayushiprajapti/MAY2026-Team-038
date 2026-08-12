import zlib
from uuid import uuid4

import fakeredis

from services import trails_service
from utils import redis_client
from utils.cache import clear_all


class _FakeTrailsCursor:
    """trails_service.get_dynamic_trails issues exactly one query, so this
    cursor ignores the SQL text entirely and always returns the canned rows
    it was constructed with - already shaped as if PostGIS had produced
    them (dbscan_cluster_id pre-computed, one row per site)."""

    def __init__(self, rows: list[dict]):
        self._rows = rows

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def execute(self, query, params=None):
        pass

    def fetchall(self):
        return self._rows


class _FakeTrailsConnection:
    def __init__(self, rows: list[dict]):
        self._rows = rows

    def cursor(self, cursor_factory=None):
        return _FakeTrailsCursor(self._rows)


def _site_row(
    cluster_id, name: str, lat: float, lon: float, region: str = "Pune"
) -> dict:
    return {
        "id": uuid4(),
        "name": name,
        "category": "built",
        "image_url": None,
        "description": f"{name} description",
        "region_name": region,
        "latitude": lat,
        "longitude": lon,
        "dbscan_cluster_id": cluster_id,
    }


def setup_function():
    redis_client.set_redis_client(fakeredis.FakeRedis())
    clear_all()


def test_groups_sites_by_dbscan_cluster():
    rows = [
        _site_row(0, "Shaniwar Wada", 18.520, 73.856),
        _site_row(0, "Lal Mahal", 18.521, 73.857),
        _site_row(1, "Sinhagad Fort", 18.366, 73.755),
    ]
    conn = _FakeTrailsConnection(rows)

    trails = trails_service.get_dynamic_trails(conn)

    assert len(trails) == 2
    site_counts = sorted(len(t.sites) for t in trails)
    assert site_counts == [1, 2]


def test_trail_name_derived_from_path_start():
    # Alphabetically "Lal Mahal" sorts before "Shaniwar Wada", so the greedy
    # path starts there regardless of input row order.
    rows = [
        _site_row(0, "Shaniwar Wada", 18.520, 73.856),
        _site_row(0, "Lal Mahal", 18.521, 73.857),
    ]
    conn = _FakeTrailsConnection(rows)

    trails = trails_service.get_dynamic_trails(conn)

    assert len(trails) == 1
    assert trails[0].name == "Lal Mahal & Surroundings Trail"


def test_trail_region_taken_from_path_start():
    rows = [_site_row(0, "Shaniwar Wada", 18.52, 73.85, region="Pune")]
    conn = _FakeTrailsConnection(rows)

    trails = trails_service.get_dynamic_trails(conn)

    assert trails[0].region == "Pune"


def test_no_approved_sites_returns_empty_list():
    conn = _FakeTrailsConnection([])

    trails = trails_service.get_dynamic_trails(conn)

    assert trails == []


def test_single_site_trail_has_zero_distance():
    rows = [_site_row(0, "Lone Site", 18.5, 73.8)]
    conn = _FakeTrailsConnection(rows)

    trails = trails_service.get_dynamic_trails(conn)

    assert trails[0].distance_km == 0.0


def test_distance_is_real_haversine_not_a_flat_constant():
    # Two points ~1.2km apart (rough real-world Pune coordinates), not the
    # old hardcoded "5.0km for any multi-site trail" placeholder.
    rows = [
        _site_row(0, "Site A", 18.5204, 73.8567),
        _site_row(0, "Site B", 18.5300, 73.8567),
    ]
    conn = _FakeTrailsConnection(rows)

    trails = trails_service.get_dynamic_trails(conn)

    assert 1.0 < trails[0].distance_km < 1.2


def test_path_visits_nearest_site_next_not_alphabetically():
    # C is alphabetically last but geographically closest to the start (A).
    # A path-ordered trail must visit A -> C -> B, not A -> B -> C.
    rows = [
        _site_row(0, "A Site", 18.500, 73.800),
        _site_row(0, "B Site", 18.700, 73.800),  # far
        _site_row(0, "C Site", 18.501, 73.800),  # very close to A
    ]
    conn = _FakeTrailsConnection(rows)

    trails = trails_service.get_dynamic_trails(conn)

    ordered_names = [s.name for s in trails[0].sites]
    assert ordered_names == ["A Site", "C Site", "B Site"]


def test_cluster_larger_than_max_size_splits_into_contiguous_chunks():
    # 7 sites in a straight line, > MAX_SITES_PER_TRAIL (5) - must become
    # two trails that are each a contiguous slice of the walked path, not
    # a leftover 1-site trail from alphabetical bucketing.
    rows = [
        _site_row(0, f"Site {chr(ord('A') + i)}", 18.5 + i * 0.01, 73.8)
        for i in range(7)
    ]
    conn = _FakeTrailsConnection(rows)

    trails = trails_service.get_dynamic_trails(conn)

    assert len(trails) == 2
    sizes = sorted(len(t.sites) for t in trails)
    assert sizes == [2, 5]


def test_trail_id_is_deterministic_across_calls():
    rows = [_site_row(0, "Shaniwar Wada", 18.52, 73.85)]

    first = trails_service.get_dynamic_trails(_FakeTrailsConnection(rows))
    trails_service.get_dynamic_trails.cache_clear()
    second = trails_service.get_dynamic_trails(_FakeTrailsConnection(rows))

    assert first[0].trail_id == second[0].trail_id
    assert first[0].trail_id == zlib.crc32(b"0_0") % (10 ** 8)


def test_result_is_cached_across_calls_with_different_connections():
    rows = [_site_row(0, "Shaniwar Wada", 18.52, 73.85)]
    conn_a = _FakeTrailsConnection(rows)
    conn_b = _FakeTrailsConnection([])  # would produce a different result if hit

    first = trails_service.get_dynamic_trails(conn_a)
    second = trails_service.get_dynamic_trails(conn_b)

    assert first == second
    assert len(second) == 1


def test_site_fields_are_preserved_through_grouping():
    row = _site_row(0, "Shaniwar Wada", 18.52, 73.85)
    row["image_url"] = "https://example.com/img.jpg"
    row["description"] = "A historic fort in Pune."
    conn = _FakeTrailsConnection([row])

    trails = trails_service.get_dynamic_trails(conn)

    site = trails[0].sites[0]
    assert site.id == row["id"]
    assert site.image_url == "https://example.com/img.jpg"
    assert site.description == "A historic fort in Pune."
    assert site.latitude == 18.52
    assert site.longitude == 73.85
