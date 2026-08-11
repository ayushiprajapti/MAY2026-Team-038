from pydantic import BaseModel
from uuid import UUID

class TrailSiteResponse(BaseModel):
    id: UUID
    name: str
    category: str | None = None
    latitude: float
    longitude: float
    image_url: str | None = None
    description: str | None = None
    region_name: str | None = None

class TrailClusterResponse(BaseModel):
    trail_id: int
    name: str
    region: str | None = None
    sites: list[TrailSiteResponse]

class DynamicTrailsResponse(BaseModel):
    trails: list[TrailClusterResponse]
