from datetime import date
from pydantic import BaseModel


class ShopStatsResponse(BaseModel):
    total_orders: int
    total_revenue_cents: int
    pending_orders: int
    delivered_orders: int


class EventResponse(BaseModel):
    id: str
    title: str
    venue: str
    event_date: date
    status: str


class VolunteerUploadResponse(BaseModel):
    id: str
    name: str
    submitted_by: str
    status: str
    image_url: str | None
    created_at: str


class DashboardEventsResponse(BaseModel):
    today: list[EventResponse]
    upcoming: list[EventResponse]


class DashboardRecentUploadsResponse(BaseModel):
    uploads: list[VolunteerUploadResponse]