from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from psycopg2.extensions import connection

from database import get_db
from schemas.heritage_review import (
    HeritageSubmissionResponse,
    PaginatedHeritageResponse,
    RegionResponse,
    ReviewRequest,
)
from services.heritage_review_service import (
    get_pending_submissions,
    get_submissions_page,
    warm_pending_submissions_cache,
    get_submission_by_id,
    get_all_regions,
    approve_submission,
    reject_submission,
    delete_submission,
)
from utils.auth import get_current_user

router = APIRouter(
    prefix="/admin/heritage-submissions",
    tags=["Admin Heritage Review"],
)


@router.get("/regions", response_model=list[RegionResponse])
def get_regions(
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return get_all_regions(conn)


@router.get(
    "",
    response_model=PaginatedHeritageResponse,
)
def get_all_pending(
    background_tasks: BackgroundTasks,
    status: str | None = "pending_review",
    category: str | None = None,
    region_id: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Defaults to pending_review only. Pass ?status=approved/rejected to
    filter by another status, or ?status=all to see every submission."""
    status_filter = None if status in (None, "all") else status

    if get_pending_submissions.is_cached(status_filter, category=category, region_id=region_id):
        # Warm cache already holds the full filtered list - slice it in
        # memory, no DB round trip at all.
        all_items = get_pending_submissions(
            conn,
            status_filter,
            category=category,
            region_id=region_id,
        )
        total = len(all_items)
        start = (page - 1) * page_size
        items = all_items[start : start + page_size]
    else:
        # Cache miss: answer with a fast direct LIMIT/OFFSET query for just
        # this page, then backfill the full list in the background so the
        # next page (or a repeat of this one) hits the warm cache instead.
        items, total = get_submissions_page(
            conn, status_filter, category, region_id, page, page_size
        )
        background_tasks.add_task(
            warm_pending_submissions_cache, status_filter, category, region_id
        )

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


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
