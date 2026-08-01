from datetime import date, datetime, time
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


# Valid event_type values must match the DB enum exactly
EventType = Literal[
    "heritage_walk",
    "workshop",
    "quiz",
    "competition",
    "cultural_event",
]

# Valid status values must match the DB enum exactly
EventStatus = Literal["draft", "published", "cancelled", "completed"]


class CreateEventRequest(BaseModel):
    """Payload for the admin 'Publish Event' form."""

    title: str = Field(min_length=1, max_length=255)
    event_date: date
    start_time: time
    end_time: time | None = None
    venue: str | None = Field(default=None, max_length=500)
    participant_limit: int = Field(gt=0)
    registration_deadline: datetime | None = None
    event_type: EventType
    description: str | None = None


class UpdateEventRequest(BaseModel):
    """Partial-update payload for editing an existing event.

    Every field is optional — only the fields sent in the request body
    will be written to the database (PATCH semantics).
    """

    title: str | None = Field(default=None, min_length=1, max_length=255)
    event_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None
    venue: str | None = Field(default=None, max_length=500)
    participant_limit: int | None = Field(default=None, gt=0)
    registration_deadline: datetime | None = None
    event_type: EventType | None = None
    description: str | None = None
    status: EventStatus | None = None


class AdminEventResponse(BaseModel):
    id: UUID
    title: str
    description: str | None
    event_type: str
    venue: str | None
    event_date: date
    start_time: time
    end_time: time | None
    participant_limit: int
    registration_deadline: datetime | None
    coordinator_id: UUID | None
    status: str
    registration_count: int


class AdminEventsListResponse(BaseModel):
    """Top-level response for GET /events/admin/.

    Includes the three summary stat cards shown on the Event Management
    dashboard plus the full paginated/filtered event rows.
    """

    # Stat cards
    upcoming_events: int      # published events whose event_date >= today
    total_registrations: int  # confirmed + waitlisted across ALL events
    completed_events: int     # events with status = 'completed'

    # Event table rows
    events: list[AdminEventResponse]


class RegistrantResponse(BaseModel):
    """One row in the Registered Attendees table."""

    registration_id: UUID
    user_id: UUID
    full_name: str
    email: str
    phone: str | None          # users.phone — nullable in schema
    registration_status: str   # confirmed | waitlisted | cancelled
    registered_at: datetime

    # NOTE: 'attendees' (guest count) and 'note' columns shown in the UI
    # are NOT present in the current schema.dbml event_registrations table.
    # Flag to the team before adding those columns to the live DB.


class EventRegistrantsResponse(BaseModel):
    """Response for GET /events/admin/{event_id}/registrations.

    Contains the event header fields (title, date, venue) plus the
    full attendee list with a pre-counted total.
    """

    # Event header (shown at top of the attendee view)
    event_id: UUID
    title: str
    event_date: date
    start_time: time
    end_time: time | None
    venue: str | None

    # Attendee list
    total_registrations: int
    registrants: list[RegistrantResponse]
