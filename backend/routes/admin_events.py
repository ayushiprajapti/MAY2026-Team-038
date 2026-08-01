from uuid import UUID

from fastapi import APIRouter, Depends

from database import get_db
from schemas.events import (
    CreateEventRequest,
    UpdateEventRequest,
    EventListResponse,
    EventDetailResponse,
    EventActionResponse,
)
from services.events_service import (
    list_events,
    get_event,
    create_event,
    update_event,
    delete_event,
)
from utils.auth import get_current_user

router = APIRouter(
    prefix="/admin/events",
    tags=["Admin Events"],
)


@router.get(
    "",
    response_model=EventListResponse,
)
def get_all_events(
    conn=Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return list_events(conn)


@router.get(
    "/{event_id}",
    response_model=EventDetailResponse,
)
def get_event_by_id(
    event_id: UUID,
    conn=Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return get_event(conn, str(event_id))


@router.post(
    "",
    response_model=EventActionResponse,
    status_code=201,
)
def create_new_event(
    request: CreateEventRequest,
    conn=Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    data = request.model_dump()

    # Convert UUIDs to strings for psycopg2
    data["site_id"] = str(data["site_id"])
    data["coordinator_id"] = str(data["coordinator_id"])

    result = create_event(
        conn,
        data,
    )

    conn.commit()

    return {
        "message": result["message"]
    }


@router.patch(
    "/{event_id}",
    response_model=EventActionResponse,
)
def update_existing_event(
    event_id: UUID,
    request: UpdateEventRequest,
    conn=Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    data = request.model_dump(exclude_unset=True)

    if "site_id" in data and data["site_id"] is not None:
        data["site_id"] = str(data["site_id"])

    if "coordinator_id" in data and data["coordinator_id"] is not None:
        data["coordinator_id"] = str(data["coordinator_id"])

    result = update_event(
        conn,
        str(event_id),
        data,
    )

    conn.commit()

    return result


@router.delete(
    "/{event_id}",
    response_model=EventActionResponse,
)
def delete_existing_event(
    event_id: UUID,
    conn=Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = delete_event(
        conn,
        str(event_id),
    )

    conn.commit()

    return result
