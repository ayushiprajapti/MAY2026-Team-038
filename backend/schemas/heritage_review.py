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
    status: str
    submitted_by: Optional[UUID] = None
    reviewed_by: Optional[UUID] = None
    reviewed_at: Optional[datetime] = None
    review_notes: Optional[str] = None
    region_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime


class ReviewRequest(BaseModel):
    reviewed_by: UUID
    review_notes: Optional[str] = None