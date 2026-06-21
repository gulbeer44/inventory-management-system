from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Numeric
from sqlalchemy import String

from sqlalchemy.dialects.postgresql import UUID

from app.models.base import BaseModel


class Order(BaseModel):
    __tablename__ = "orders"

    customer_id = Column(
        UUID(as_uuid=True),
        ForeignKey("customers.id"),
        nullable=False
    )

    status = Column(
        String(20),
        default="PLACED"
    )

    total_amount = Column(
        Numeric(10, 2),
        nullable=False,
        default=0
    )