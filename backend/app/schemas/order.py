from uuid import UUID

from pydantic import BaseModel
from pydantic import Field


class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    customer_id: UUID
    items: list[OrderItemCreate]


class OrderResponse(BaseModel):
    id: UUID
    customer_id: UUID
    status: str
    total_amount: float

    class Config:
        from_attributes = True