from uuid import uuid4

from fastapi import HTTPException, status
from psycopg2.extensions import connection
from psycopg2.extras import RealDictCursor

from schemas.auth import SignupRequest
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


def get_user_by_id(conn: connection, user_id: str) -> dict | None:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT id, email, full_name FROM users WHERE id = %s", (user_id,))
        return cur.fetchone()
