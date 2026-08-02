from fastapi import APIRouter, Depends
from psycopg2.extensions import connection

from database import get_db
from rag import chat_service
from schemas.chat import ChatMessageResponse, ChatSessionResponse, SendMessageRequest
from utils.auth import get_current_user

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/sessions", response_model=ChatSessionResponse, status_code=201)
def start_session(
    current_user: dict = Depends(get_current_user), conn: connection = Depends(get_db)
) -> dict:
    return chat_service.create_session(conn, str(current_user["id"]))


@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse)
def send_message(
    session_id: str,
    payload: SendMessageRequest,
    current_user: dict = Depends(get_current_user),
    conn: connection = Depends(get_db),
) -> dict:
    return chat_service.send_message(conn, session_id, str(current_user["id"]), payload.content)


@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageResponse])
def read_messages(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    conn: connection = Depends(get_db),
) -> list[dict]:
    chat_service.get_owned_session(conn, session_id, str(current_user["id"]))
    return chat_service.list_messages(conn, session_id)
