from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str
    phone: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    phone: str | None = None
    role: str | None = None
    is_active: bool = True


class UpdateProfileRequest(BaseModel):
    full_name: str | None = Field(default=None, min_length=1)
    phone: str | None = None
    roles: list[str] = []


class AssignRoleRequest(BaseModel):
    role: str


class UserWithRolesResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    roles: list[str] = []


class RoleMutationResponse(BaseModel):
    id: UUID
    roles: list[str] = []
