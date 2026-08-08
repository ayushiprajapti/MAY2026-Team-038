from fastapi import APIRouter, Depends
from psycopg2.extensions import connection

from database import get_db
from schemas.auth import AssignRoleRequest, RoleMutationResponse, UserWithRolesResponse
from services import auth_service
from utils.auth import require_roles

router = APIRouter(
    prefix="/admin/users",
    tags=["admin-users"],
)


@router.get("", response_model=list[UserWithRolesResponse])
def list_users(
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("system_admin")),
):
    return auth_service.list_users_with_roles(conn)


@router.post("/{user_id}/roles", response_model=RoleMutationResponse)
def assign_role(
    user_id: str,
    payload: AssignRoleRequest,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("system_admin")),
):
    return auth_service.add_user_role(conn, user_id, payload.role)


@router.delete("/{user_id}/roles/{role}", response_model=RoleMutationResponse)
def revoke_role(
    user_id: str,
    role: str,
    conn: connection = Depends(get_db),
    current_user: dict = Depends(require_roles("system_admin")),
):
    return auth_service.remove_user_role(conn, user_id, role)
