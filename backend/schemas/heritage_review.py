from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class HeritageSubmissionResponse(BaseModel):
    id: UUID
    name: Optional[str] = None
    category: Optional[str] = None
    address: Optional[str] = None
    construction_period: Optional[str] = None
    historical_significance: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = None
    submitted_by: Optional[UUID] = None
    reviewed_by: Optional[UUID] = None
    reviewed_at: Optional[datetime] = None
    review_notes: Optional[str] = None
    region_id: Optional[UUID] = None
    region_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ReviewRequest(BaseModel):
    review_notes: Optional[str] = None


class RegionResponse(BaseModel):
    id: UUID
    name: Optional[str] = None


class PaginatedHeritageResponse(BaseModel):
    items: list[HeritageSubmissionResponse]
    total: int
    page: int
    page_size: int
