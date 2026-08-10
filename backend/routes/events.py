from typing import Annotated

from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status
from psycopg2.extensions import connection

from database import get_db
from schemas.events import (
    EventType,
    EventRegistrationRequest,
    EventRegistrationResponse,
    PublicEventsListResponse,
    UserRegistrationResponse,
)
from services import event_service
from utils.auth import get_current_user

router = APIRouter(prefix="/events", tags=["events"])


@router.get("/", response_model=PublicEventsListResponse)
def list_upcoming_events(
    event_type: Annotated[EventType | None, Query(alias="type")] = None,
    conn: connection = Depends(get_db),
) -> dict:
    """List all published upcoming events (today or later).

    Optional query parameter ``?type=heritage_walk`` filters to a single
    event category — matches the 'All events' dropdown in the UI.

    No authentication required.

    **Response shape**
    ```json
    {
      "events": [
        {
          "id": "...",
          "title": "Stories in Stone: Shaniwar Wada Walk",
          "event_type": "heritage_walk",
          "event_date": "2026-07-19",
          "start_time": "08:00:00",
          "end_time": "10:30:00",
          "venue": "Shaniwar Wada, Pune",
          "participant_limit": 30,
          "seats_left": 14,
          "registration_deadline": null,
          "status": "published",
          ...
        }
      ]
    }
    ```
    """
    return event_service.list_upcoming_events(conn, event_type=event_type)


@router.post("/{event_id}/register", response_model=EventRegistrationResponse, status_code=status.HTTP_201_CREATED)
def register_for_event(
    event_id: UUID,
    payload: EventRegistrationRequest,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Register the signed-in user for an upcoming published event.

    The endpoint confirms the registration when space remains; otherwise it
    creates a waitlist entry. A user can have only one registration per event.
    """
    return event_service.register_for_event(
        conn, str(event_id), str(current_user["id"]), payload
    )


@router.delete("/{event_id}/register", status_code=status.HTTP_204_NO_CONTENT)
def revoke_event_registration(
    event_id: UUID,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> Response:
    """Revoke the signed-in user's active event registration.

    The registration stays in the user's history as cancelled. If it was a
    confirmed registration, the earliest waitlisted attendee is promoted.
    """
    event_service.revoke_event_registration(
        conn, str(event_id), str(current_user["id"])
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/my-history", response_model=list[UserRegistrationResponse])
def my_event_history(
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    """Return the authenticated user's full event registration history.

    Includes every registration state: registered, revoked, attended, and
    waitlisted. ``history_status`` is a display-ready status; the raw
    registration and event statuses are also returned for full context.

    Results are ordered most-recent-event-date first.

    **Response shape**
    ```json
    [
      {
        "registration_id": "...",
        "registration_status": "confirmed",
        "registered_at": "2026-06-01T10:00:00Z",
        "event_id": "...",
        "title": "Bhuleshwar Temple Heritage Walk",
        "event_type": "heritage_walk",
        "event_date": "2026-06-28",
        "start_time": "08:00:00",
        "end_time": "10:00:00",
        "venue": "Bhuleshwar Temple",
        "event_status": "completed"
      }
    ]
    ```
    """
    return event_service.list_user_event_history(conn, str(current_user["id"]))
