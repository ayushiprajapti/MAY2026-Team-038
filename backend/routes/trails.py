from fastapi import APIRouter, Depends
from psycopg2.extensions import connection

from database import get_db
from schemas.trails import DynamicTrailsResponse
from services import trails_service

router = APIRouter(prefix="/trails", tags=["trails"])

@router.get("/dynamic", response_model=DynamicTrailsResponse)
def get_dynamic_trails(
    conn: connection = Depends(get_db),
) -> dict:
    """
    Returns dynamically generated heritage trails.
    Uses PostGIS ST_ClusterDBSCAN to group approved heritage sites that are
    within a 5km radius of each other into distinct trails.
    """
    return {"trails": trails_service.get_dynamic_trails(conn)}
