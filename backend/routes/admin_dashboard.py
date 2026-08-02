from fastapi import APIRouter, Depends
from psycopg2.extensions import connection

from database import get_db
from schemas.dashboard import (
    ShopStatsResponse,
    DashboardEventsResponse,
    DashboardRecentUploadsResponse,
)
from services import dashboard_service
from utils.auth import get_current_user

router = APIRouter(
    prefix="/admin/dashboard",
    tags=["admin-dashboard"],
)


@router.get("/shop-stats", response_model=ShopStatsResponse)
def get_shop_stats(
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return dashboard_service.get_shop_stats(conn)


@router.get("/events", response_model=DashboardEventsResponse)
def get_dashboard_events(
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return dashboard_service.get_dashboard_events(conn)


@router.get("/recent-volunteers", response_model=DashboardRecentUploadsResponse)
def get_recent_uploads(
    conn: connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return dashboard_service.get_recent_volunteer_uploads(conn)
