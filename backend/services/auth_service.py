from uuid import uuid4

from fastapi import HTTPException, status
from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor

from schemas.auth import SignupRequest
from utils.cache import cached
from utils.security import hash_password, verify_password

DEFAULT_SIGNUP_ROLE = "registered_member"


def create_user(conn: connection, data: SignupRequest) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id FROM users WHERE email = %s", (data.email,))
        if cur.fetchone():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
            )

        new_id = str(uuid4())
        password_hash = hash_password(data.password)
        cur.execute(
            """
            INSERT INTO users (id, email, password_hash, full_name, is_active, created_at)
            VALUES (%s, %s, %s, %s, TRUE, now())
            RETURNING id, email, full_name
            """,
            (new_id, data.email, password_hash, data.full_name),
        )
        user = cur.fetchone()

        cur.execute(
            "INSERT INTO user_roles (user_id, role) VALUES (%s, %s)",
            (new_id, DEFAULT_SIGNUP_ROLE),
        )

        return user


def authenticate_user(conn: connection, email: str, password: str) -> dict:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            "SELECT id, email, full_name, password_hash, is_active FROM users WHERE email = %s",
            (email,),
        )
        user = cur.fetchone()

    if (
        not user
        or not user["is_active"]
        or not verify_password(password, user["password_hash"])
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    return user


@cached(ttl_seconds=60)
def get_user_by_id(conn: connection, user_id: str) -> dict | None:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id, email, full_name FROM users WHERE id = %s", (user_id,))
        return cur.fetchone()


@cached(ttl_seconds=60)
def get_user_roles(conn: connection, user_id: str) -> list[str]:
    with conn.cursor() as cur:
        cur.execute("SELECT role FROM user_roles WHERE user_id = %s", (user_id,))
        return [row[0] for row in cur.fetchall()]


VALID_ROLES = {
    "registered_member",
    "volunteer",
    "event_coordinator",
    "heritage_expert",
    "shop_admin",
    "system_admin",
}


def list_users_with_roles(conn: connection) -> list[dict]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            SELECT
                u.id,
                u.email,
                u.full_name,
                COALESCE(array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), '{}') AS roles
            FROM users u
            LEFT JOIN user_roles ur ON ur.user_id = u.id
            GROUP BY u.id, u.email, u.full_name
            ORDER BY u.full_name
            """
        )
        return cur.fetchall()


def add_user_role(conn: connection, user_id: str, role: str) -> dict:
    if role not in VALID_ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown role '{role}'. Valid roles: {sorted(VALID_ROLES)}",
        )

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id FROM users WHERE id = %s", (user_id,))
        if cur.fetchone() is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        cur.execute(
            "INSERT INTO user_roles (user_id, role) VALUES (%s, %s) ON CONFLICT DO NOTHING",
            (user_id, role),
        )

    get_user_roles.cache_clear()
    return {"id": user_id, "roles": get_user_roles(conn, user_id)}


def remove_user_role(conn: connection, user_id: str, role: str) -> dict:
    with conn.cursor() as cur:
        cur.execute(
            "DELETE FROM user_roles WHERE user_id = %s AND role = %s",
            (user_id, role),
        )

    get_user_roles.cache_clear()
    return {"id": user_id, "roles": get_user_roles(conn, user_id)}
