from datetime import date, datetime, time
from uuid import UUID

from pydantic import BaseModel


# ---------- Create Event ----------

class CreateEventRequest(BaseModel):
    title: str
    description: str
    event_type: str
    site_id: UUID
    venue: str
    event_date: date
    start_time: time
    end_time: time
    participant_limit: int
    registration_deadline: datetime
    coordinator_id: UUID
    status: str


# ---------- Update Event ----------

class UpdateEventRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    event_type: str | None = None
    site_id: UUID | None = None
    venue: str | None = None
    event_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None
    participant_limit: int | None = None
    registration_deadline: datetime | None = None
    coordinator_id: UUID | None = None
    status: str | None = None


# ---------- Event List ----------

class EventListItem(BaseModel):
    id: UUID
    title: str
    description: str | None
    event_type: str
    heritage_site: str | None
    venue: str
    event_date: date
    start_time: time
    end_time: time
    participant_limit: int
    registration_deadline: datetime
    coordinator_name: str | None
    status: str
    registrations: int


class EventListResponse(BaseModel):
    events: list[EventListItem]


# ---------- Event Detail ----------

class EventDetailResponse(BaseModel):
    id: UUID
    title: str
    description: str | None
    event_type: str
    site_id: UUID | None
    heritage_site: str | None
    venue: str
    event_date: date
    start_time: time
    end_time: time
    participant_limit: int
    registration_deadline: datetime
    coordinator_id: UUID | None
    coordinator_name: str | None
    status: str
    created_at: datetime


# ---------- Generic Response ----------

class EventActionResponse(BaseModel):
    message: str