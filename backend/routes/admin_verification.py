from fastapi import APIRouter, Depends
from psycopg2.extensions import connection

from database import get_db
from schemas.verification import (
    VerificationListResponse,
    VerificationDetailResponse,
    ReviewRequest,
    ReviewResponse,
)
from services import verification_service
from utils.auth import get_current_user

router = APIRouter(
    prefix="/admin/verification",
    tags=["admin-verification"],
)


@router.get(
    "",
    response_model=VerificationListResponse,
)
def get_all_submissions(
    conn: connection = Depends(get_db),
):
    return verification_service.list_submissions(conn)


@router.get(
    "/{submission_id}",
    response_model=VerificationDetailResponse,
)
def get_submission(
    submission_id: str,
    conn: connection = Depends(get_db),
):
    return verification_service.get_submission(
        conn,
        submission_id,
    )


@router.patch(
    "/{submission_id}/approve",
    response_model=ReviewResponse,
)
def approve_submission(
    submission_id: str,
    payload: ReviewRequest,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return verification_service.approve_submission(
        conn,
        submission_id,
        str(current_user["id"]),
        payload.review_notes,
    )


@router.patch(
    "/{submission_id}/reject",
    response_model=ReviewResponse,
)
def reject_submission(
    submission_id: str,
    payload: ReviewRequest,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return verification_service.reject_submission(
        conn,
        submission_id,
        str(current_user["id"]),
        payload.review_notes,
    )