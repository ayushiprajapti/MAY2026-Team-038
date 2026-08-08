from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


HeritageCategory = Literal[
    "built",
    "natural",
    "craft",
    "intangible",
]


class CreateHeritageSubmissionRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    category: HeritageCategory
    address: str | None = Field(default=None, max_length=500)
    construction_period: str | None = None
    historical_significance: str | None = None
    description: str | None = None
    image_url: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class ImageUploadResponse(BaseModel):
    image_url: str


class VolunteerHeritageSubmissionResponse(BaseModel):
    id: UUID
    name: str | None
    category: str | None
    address: str | None
    construction_period: str | None
    historical_significance: str | None
    description: str | None
    image_url: str | None
    latitude: float | None
    longitude: float | None
    status: str | None
    submitted_by: UUID | None
    reviewed_at: datetime | None
    review_notes: str | None
    created_at: datetime
    updated_at: datetime