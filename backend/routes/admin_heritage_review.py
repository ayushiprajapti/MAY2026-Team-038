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

router = APIRouter(
    prefix="/admin/heritage-submissions",
    tags=["Admin Heritage Review"],
)


@router.get(
    "",
    response_model=list[HeritageSubmissionResponse],
)
def get_all_pending(
    conn: connection = Depends(get_db),
):
    return get_pending_submissions(conn)


@router.get(
    "/{submission_id}",
    response_model=HeritageSubmissionResponse,
)
def get_one_submission(
    submission_id: UUID,
    conn: connection = Depends(get_db),
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
):
    submission = approve_submission(
        conn,
        submission_id,
        body.reviewed_by,
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
):
    submission = reject_submission(
        conn,
        submission_id,
        body.reviewed_by,
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