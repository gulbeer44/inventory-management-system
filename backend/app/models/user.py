from sqlalchemy import Column
from sqlalchemy import String

from app.models.base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(20),
        default="admin"
    )