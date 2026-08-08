from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from psycopg2.extensions import connection

from database import get_db
from schemas.volunteer_heritage import (
    CreateHeritageSubmissionRequest,
    ImageUploadResponse,
    VolunteerHeritageSubmissionResponse,
)
from services import volunteer_heritage_service
from utils.auth import get_current_user


router = APIRouter(
    prefix="/volunteer/heritage-submissions",
    tags=["Volunteer Heritage"],
)


@router.post(
    "",
    response_model=VolunteerHeritageSubmissionResponse,
    status_code=201,
)
def create_heritage_submission(
    payload: CreateHeritageSubmissionRequest,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return volunteer_heritage_service.create_submission(
        conn,
        current_user["id"],
        payload,
    )


@router.post(
    "/upload-image",
    response_model=ImageUploadResponse,
    status_code=201,
)
def upload_heritage_submission_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    image_url = volunteer_heritage_service.save_submission_image(file)
    return {"image_url": image_url}


@router.get(
    "",
    response_model=list[VolunteerHeritageSubmissionResponse],
)
def get_my_heritage_submissions(
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return volunteer_heritage_service.get_my_submissions(
        conn,
        current_user["id"],
    )


@router.get(
    "/{submission_id}",
    response_model=VolunteerHeritageSubmissionResponse,
)
def get_my_heritage_submission(
    submission_id: UUID,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    submission = volunteer_heritage_service.get_my_submission(
        conn,
        current_user["id"],
        submission_id,
    )

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Heritage submission not found",
        )

    return submission