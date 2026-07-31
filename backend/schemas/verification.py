from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class VerificationListItem(BaseModel):
    id: UUID
    name: str
    category: str
    status: str
    image_url: str | None
    submitted_by: str
    created_at: datetime


class VerificationListResponse(BaseModel):
    submissions: list[VerificationListItem]


class VerificationDetailResponse(BaseModel):
    id: UUID
    name: str
    category: str
    address: str
    construction_period: str | None
    historical_significance: str |None
    description: str
    image_url: str | None
    status: str
    submitted_by: str
    created_at: datetime
    review_notes: str | None


class ReviewRequest(BaseModel):
    review_notes: str | None = None


class ReviewResponse(BaseModel):
    message: str