import zlib

from psycopg2.extensions import connection
from psycopg2.extras import DictCursor

from schemas.trails import TrailClusterResponse, TrailSiteResponse
from utils.cache import cached

_QUERY = """
WITH clustered_sites AS (
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
),
numbered_sites AS (
    SELECT
        *,
        -- Assign a row number within each DBSCAN cluster
        ROW_NUMBER() OVER (PARTITION BY dbscan_cluster_id ORDER BY name) - 1 AS rn
    FROM clustered_sites
)
SELECT
    *,
    -- Create a unique trail_id by combining the dbscan cluster ID and a chunk index (every 5 sites)
    -- e.g. '1_0' for the first 5 sites, '1_1' for the next 5.
    dbscan_cluster_id::text || '_' || (rn / 5)::text AS trail_chunk_id
FROM numbered_sites
ORDER BY dbscan_cluster_id, rn;
"""


@cached(ttl_seconds=300)
def get_dynamic_trails(conn: connection) -> list[TrailClusterResponse]:
    """DBSCAN-clusters approved heritage sites into trails. Cached (5min TTL)
    since site approvals are infrequent - warmed on login so the first
    dashboard load after auth doesn't pay the clustering cost."""
    with conn.cursor(cursor_factory=DictCursor) as cur:
        cur.execute(_QUERY)
        rows = cur.fetchall()

    clusters: dict[str, list[TrailSiteResponse]] = {}

    for row in rows:
        trail_id = row["trail_chunk_id"]
        if trail_id not in clusters:
            clusters[trail_id] = []

        clusters[trail_id].append(
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
    for trail_id, sites in clusters.items():
        primary_site_name = sites[0].name
        trail_name = f"{primary_site_name} & Surroundings Trail"
        trail_region = getattr(sites[0], "region_name", None)

        response_trails.append(
            TrailClusterResponse(
                # zlib.crc32 is deterministic across process restarts, unlike
                # Python's built-in hash() which is salted per-process for str.
                trail_id=zlib.crc32(trail_id.encode()) % (10 ** 8),
                name=trail_name,
                region=trail_region,
                sites=sites,
            )
        )

    return response_trails
