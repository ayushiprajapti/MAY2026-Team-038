import zlib
from math import asin, cos, radians, sin, sqrt

from psycopg2.extensions import connection
from psycopg2.extras import DictCursor

from schemas.trails import TrailClusterResponse, TrailSiteResponse
from utils.cache import cached

# A trail longer than this many stops gets split into path-contiguous
# chunks (see _chunk_path) rather than shown as one long walk.
MAX_SITES_PER_TRAIL = 5

_EARTH_RADIUS_KM = 6371.0

_QUERY = """
SELECT
    hs.id,
    hs.name,
    hs.category,
    hs.image_url,
    hs.description,
    r.name AS region_name,
    ST_Y(hs.location::geometry) AS latitude,
    ST_X(hs.location::geometry) AS longitude,
    -- Group into clusters where points are within 5km (5000 meters) of each other
    ST_ClusterDBSCAN(ST_Transform(hs.location::geometry, 3857), eps := 5000, minpoints := 1) OVER () AS dbscan_cluster_id
FROM heritage_sites hs
LEFT JOIN regions r ON hs.region_id = r.id
WHERE hs.status = 'approved'
  AND hs.location IS NOT NULL
ORDER BY dbscan_cluster_id, hs.name;
"""


def _haversine_km(a: TrailSiteResponse, b: TrailSiteResponse) -> float:
    lat1, lon1, lat2, lon2 = map(radians, (a.latitude, a.longitude, b.latitude, b.longitude))
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    h = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    return 2 * _EARTH_RADIUS_KM * asin(sqrt(h))


def _nearest_neighbor_path(sites: list[TrailSiteResponse]) -> list[TrailSiteResponse]:
    """Greedy nearest-neighbor ordering, starting from the alphabetically
    first site so the result is deterministic across calls (required for
    the trail_id hash and the Redis cache to stay stable). Not an optimal
    TSP tour, but for the small (~5-15 site) clusters this deals with, a
    greedy walk is a reasonable approximation and keeps this O(n^2)
    instead of needing an actual solver."""
    if len(sites) <= 1:
        return list(sites)

    remaining = sorted(sites, key=lambda s: s.name)
    path = [remaining.pop(0)]

    while remaining:
        current = path[-1]
        nearest_idx = min(
            range(len(remaining)),
            key=lambda i: (_haversine_km(current, remaining[i]), remaining[i].name),
        )
        path.append(remaining.pop(nearest_idx))

    return path


def _chunk_path(path: list[TrailSiteResponse]) -> list[list[TrailSiteResponse]]:
    """Splits an ordered path into contiguous chunks of at most
    MAX_SITES_PER_TRAIL sites, so a trail is always a walkable sequence
    rather than an alphabetically-arbitrary slice of the cluster."""
    return [
        path[i : i + MAX_SITES_PER_TRAIL]
        for i in range(0, len(path), MAX_SITES_PER_TRAIL)
    ]


def _path_distance_km(path: list[TrailSiteResponse]) -> float:
    return sum(_haversine_km(path[i], path[i + 1]) for i in range(len(path) - 1))


@cached(ttl_seconds=300)
def get_dynamic_trails(conn: connection) -> list[TrailClusterResponse]:
    """DBSCAN-clusters approved heritage sites into trails, then orders each
    trail's sites into a walkable nearest-neighbor path and reports the real
    sequential distance. Cached (5min TTL) since site approvals are
    infrequent - warmed on login so the first dashboard load after auth
    doesn't pay the clustering cost."""
    with conn.cursor(cursor_factory=DictCursor) as cur:
        cur.execute(_QUERY)
        rows = cur.fetchall()

    clusters: dict[str, list[TrailSiteResponse]] = {}

    for row in rows:
        cluster_id = str(row["dbscan_cluster_id"])
        clusters.setdefault(cluster_id, []).append(
            TrailSiteResponse(
                id=row["id"],
                name=row["name"],
                category=row["category"],
                latitude=row["latitude"],
                longitude=row["longitude"],
                image_url=row["image_url"],
                description=row["description"],
                region_name=row["region_name"],
            )
        )

    response_trails = []
    for cluster_id, cluster_sites in clusters.items():
        path = _nearest_neighbor_path(cluster_sites)

        for chunk_index, chunk in enumerate(_chunk_path(path)):
            trail_chunk_id = f"{cluster_id}_{chunk_index}"
            primary_site_name = chunk[0].name
            trail_region = getattr(chunk[0], "region_name", None)

            response_trails.append(
                TrailClusterResponse(
                    # zlib.crc32 is deterministic across process restarts,
                    # unlike Python's built-in hash() which is salted
                    # per-process for str.
                    trail_id=zlib.crc32(trail_chunk_id.encode()) % (10 ** 8),
                    name=f"{primary_site_name} & Surroundings Trail",
                    region=trail_region,
                    distance_km=round(_path_distance_km(chunk), 2),
                    sites=chunk,
                )
            )

    return response_trails
