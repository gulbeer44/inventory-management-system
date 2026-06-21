from uuid import UUID

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.product import Product

from app.schemas.product import (
    ProductCreate,
    ProductResponse
)

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


@router.post(
    "",
    response_model=ProductResponse
)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db)
):

    existing_product = (
        db.query(Product)
        .filter(Product.sku == payload.sku)
        .first()
    )

    if existing_product:

        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    product = Product(
        name=payload.name,
        sku=payload.sku,
        description=payload.description,
        price=payload.price,
        stock_quantity=payload.stock_quantity
    )

    db.add(product)

    db.commit()

    db.refresh(product)

    return product


@router.get(
    "",
    response_model=list[ProductResponse]
)
def get_products(
    db: Session = Depends(get_db)
):
    return db.query(Product).all()


@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def get_product(
    product_id: UUID,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
def update_product(
    product_id: UUID,
    payload: ProductCreate,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    existing_sku = (
        db.query(Product)
        .filter(
            Product.sku == payload.sku,
            Product.id != product_id
        )
        .first()
    )

    if existing_sku:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    product.name = payload.name
    product.sku = payload.sku
    product.description = payload.description
    product.price = payload.price
    product.stock_quantity = payload.stock_quantity

    db.commit()

    db.refresh(product)

    return product


@router.delete(
    "/{product_id}"
)
def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)

    db.commit()

    return {
        "message": "Product deleted successfully"
    }