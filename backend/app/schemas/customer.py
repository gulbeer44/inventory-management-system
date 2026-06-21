from uuid import UUID

from pydantic import BaseModel
from pydantic import EmailStr


class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    address: str | None = None


class CustomerResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    phone: str | None
    address: str | None

    class Config:
        from_attributes = True