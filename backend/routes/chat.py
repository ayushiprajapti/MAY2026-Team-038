from fastapi import APIRouter, Depends
from psycopg2.extensions import connection

from database import get_db
from rag import chat_service
from schemas.chat import ChatMessageResponse, ChatSessionResponse, SendMessageRequest
from utils.auth import get_optional_user

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/sessions", response_model=ChatSessionResponse, status_code=201)
def start_session(
    current_user: dict | None = Depends(get_optional_user), conn: connection = Depends(get_db)
) -> dict:
    user_id = str(current_user["id"]) if current_user else None
    return chat_service.create_session(conn, user_id)


@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse)
def send_message(
    session_id: str,
    payload: SendMessageRequest,
    current_user: dict | None = Depends(get_optional_user),
    conn: connection = Depends(get_db),
) -> dict:
    user_id = str(current_user["id"]) if current_user else None
    return chat_service.send_message(conn, session_id, user_id, payload.content)


@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageResponse])
def read_messages(
    session_id: str,
    current_user: dict | None = Depends(get_optional_user),
    conn: connection = Depends(get_db),
) -> list[dict]:
    user_id = str(current_user["id"]) if current_user else None
    chat_service.get_owned_session(conn, session_id, user_id)
    return chat_service.list_messages(conn, session_id)
