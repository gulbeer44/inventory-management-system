from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

import app.models

from app.api.auth import router as auth_router
from app.api.products import router as product_router
from app.api.customers import router as customer_router
from app.api.orders import router as order_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory Management API",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "https://inventory-management-system-omega-lilac.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router)
app.include_router(product_router)
app.include_router(customer_router)
app.include_router(order_router)

@app.get("/")
def root():
    return {
        "message": "Inventory Management System API"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "inventory-management-api"
    }