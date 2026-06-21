from fastapi import FastAPI

from app.core.database import Base
from app.core.database import engine

import app.models

from app.api.auth import router as auth_router
from app.api.products import router as product_router
from app.api.customers import router as customer_router
from app.api.orders import router as order_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory Management API",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(product_router)
app.include_router(customer_router)
app.include_router(order_router)

@app.get("/")
def root():
    return {
        "message": "Inventory Management System API"
    }