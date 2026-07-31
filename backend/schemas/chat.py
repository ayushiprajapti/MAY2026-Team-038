from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ChatSessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    started_at: datetime
    ended_at: datetime | None = None


class SendMessageRequest(BaseModel):
    content: str = Field(min_length=1)


class ChatMessageResponse(BaseModel):
    id: UUID
    session_id: UUID
    role: str
    content: str
    referenced_site_ids: list[UUID] | None = None
    created_at: datetime
