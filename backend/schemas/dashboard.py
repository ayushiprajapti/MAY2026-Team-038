from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class ShopStatsResponse(BaseModel):
    total_orders: int
    total_revenue_cents: int
    pending_orders: int
    delivered_orders: int


class EventResponse(BaseModel):
    id: UUID
    title: str | None
    venue: str | None
    event_date: date
    status: str | None


class VolunteerUploadResponse(BaseModel):
    id: UUID
    name: str | None
    submitted_by: str | None
    status: str | None
    image_url: str | None
    created_at: datetime


class DashboardEventsResponse(BaseModel):
    today: list[EventResponse]
    upcoming: list[EventResponse]


class DashboardRecentUploadsResponse(BaseModel):
    uploads: list[VolunteerUploadResponse]