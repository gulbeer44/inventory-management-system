from sqlalchemy import Column
from sqlalchemy import String

from app.models.base import BaseModel


class Customer(BaseModel):
    __tablename__ = "customers"

    name = Column(
        String(255),
        nullable=False
    )

    email = Column(
        String(255),
        nullable=False,
        unique=True,
        index=True
    )

    phone = Column(
        String(20),
        nullable=True
    )

    address = Column(
        String(500),
        nullable=True
    )