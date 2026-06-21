from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.customer import Customer
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem

from app.schemas.order import OrderCreate, OrderResponse

router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)


@router.post("")
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db)
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == payload.customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    total_amount = 0
    products_cache = []

    for item in payload.items:

        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )

        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )

        total_amount += float(product.price) * item.quantity

        products_cache.append(
            (product, item.quantity)
        )

    order = Order(
        customer_id=payload.customer_id,
        total_amount=total_amount
    )

    db.add(order)
    db.flush()

    for product, quantity in products_cache:

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            unit_price=product.price
        )

        db.add(order_item)

        product.stock_quantity -= quantity

    try:
        db.commit()
        db.refresh(order)

    except Exception:
        db.rollback()
        raise

    return {
        "message": "Order created successfully",
        "order_id": str(order.id),
        "total_amount": total_amount
    }


@router.get(
    "",
    response_model=list[OrderResponse]
)
def get_orders(
    db: Session = Depends(get_db)
):
    return db.query(Order).all()


@router.get(
    "/{order_id}",
    response_model=OrderResponse
)
def get_order(
    order_id: UUID,
    db: Session = Depends(get_db)
):

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order