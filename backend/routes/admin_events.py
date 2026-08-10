from uuid import UUID

from fastapi import APIRouter, Depends, Response, status
from psycopg2.extensions import connection

from database import get_db
from schemas.events import (
    AdminEventResponse,
    AdminEventsListResponse,
    CreateEventRequest,
    EventRegistrantsResponse,
    UpdateEventRequest,
)
from services import event_service
from utils.auth import require_roles

router = APIRouter(prefix="/events/admin", tags=["admin-events"])


@router.get("/", response_model=AdminEventsListResponse)
def list_events(
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("system_admin")),
) -> dict:
    """List all events with dashboard stat card totals for the admin."""
    return event_service.list_all_events(conn)


@router.post("/", response_model=AdminEventResponse, status_code=201)
def create_event(
    payload: CreateEventRequest,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("system_admin")),
) -> dict:
    """Create and publish a new event. coordinator_id is taken from the auth token."""
    return event_service.create_event(
        conn, payload, coordinator_id=str(current_user["id"])
    )


@router.get("/{event_id}/registrations", response_model=EventRegistrantsResponse)
def list_event_registrants(
    event_id: UUID,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("system_admin")),
) -> dict:
    """Return the event header and full registered-attendee list for an event."""
    return event_service.list_event_registrants(conn, str(event_id))


@router.patch("/{event_id}", response_model=AdminEventResponse)
def update_event(
    event_id: UUID,
    payload: UpdateEventRequest,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("system_admin")),
) -> dict:
    """Partially update an existing event. Send only the fields you want to change."""
    return event_service.update_event(conn, str(event_id), payload)


@router.delete("/{event_id}", status_code=204)
def delete_event(
    event_id: UUID,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("system_admin")),
) -> Response:
    """Permanently delete an event and all its registrations.
    Returns 204 No Content on success, 404 if the event does not exist.
    """
    event_service.delete_event(conn, str(event_id))
    return Response(status_code=status.HTTP_204_NO_CONTENT)
