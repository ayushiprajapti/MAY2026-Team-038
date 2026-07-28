from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from psycopg2.extensions import connection

from database import get_db
from services.auth_service import get_user_by_id
from utils.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), conn: connection = Depends(get_db)
) -> dict:
    """Drop `current_user: dict = Depends(get_current_user)` into any route
    signature to require a valid Bearer token and inject the caller's user row."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_id(conn, user_id)
    if user is None:
        raise credentials_exception

    return user
