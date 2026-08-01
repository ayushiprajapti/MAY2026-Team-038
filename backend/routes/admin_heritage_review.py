from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from psycopg2.extensions import connection

from database import get_db
from schemas.heritage_review import (
    HeritageSubmissionResponse,
    ReviewRequest,
)
from services.heritage_review_service import (
    get_pending_submissions,
    get_submission_by_id,
    approve_submission,
    reject_submission,
    delete_submission,
)
from utils.auth import get_current_user

router = APIRouter(
    prefix="/admin/heritage-submissions",
    tags=["Admin Heritage Review"],
)


@router.get(
    "",
    response_model=list[HeritageSubmissionResponse],
)
def get_all_pending(
    status: str | None = "pending_review",
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Defaults to pending_review only. Pass ?status=approved/rejected to
    filter by another status, or ?status=all to see every submission."""
    status_filter = None if status in (None, "all") else status
    return get_pending_submissions(conn, status_filter)


@router.get(
    "/{submission_id}",
    response_model=HeritageSubmissionResponse,
)
def get_one_submission(
    submission_id: UUID,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    submission = get_submission_by_id(conn, submission_id)

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found",
        )

    return submission


@router.patch(
    "/{submission_id}/approve",
    response_model=HeritageSubmissionResponse,
)
def approve(
    submission_id: UUID,
    body: ReviewRequest,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    submission = approve_submission(
        conn,
        submission_id,
        current_user["id"],
        body.review_notes,
    )

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found",
        )

    return submission


@router.patch(
    "/{submission_id}/reject",
    response_model=HeritageSubmissionResponse,
)
def reject(
    submission_id: UUID,
    body: ReviewRequest,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    submission = reject_submission(
        conn,
        submission_id,
        current_user["id"],
        body.review_notes,
    )

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found",
        )

    return submission


@router.delete("/{submission_id}")
def delete(
    submission_id: UUID,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    deleted = delete_submission(conn, submission_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Submission not found",
        )

    return {
        "message": "Submission deleted successfully"
    }
