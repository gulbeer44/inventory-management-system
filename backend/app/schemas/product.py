from uuid import UUID

from pydantic import BaseModel
from pydantic import Field


class ProductCreate(BaseModel):

    name: str

    sku: str

    description: str | None = None

    price: float = Field(gt=0)

    stock_quantity: int = Field(ge=0)


class ProductResponse(BaseModel):

    id: UUID

    name: str

    sku: str

    description: str | None

    price: float

    stock_quantity: int

    class Config:
        from_attributes = True