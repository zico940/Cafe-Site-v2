from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderStatusUpdate, OrderResponse
from app.events.bus import dispatch_event

router = APIRouter(prefix="/api/orders", tags=["orders"])


def get_next_order_number(db: Session) -> int:
    last = db.query(Order).order_by(Order.id.desc()).first()
    if not last or last.order_number is None:
        return 1
    try:
        num = int(last.order_number)
        return (num % 999) + 1
    except (ValueError, TypeError):
        return 1



@router.get("", response_model=List[OrderResponse])
def get_orders(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Order)
    if status:
        query = query.filter(Order.status == status)
    return query.order_by(Order.created_at.desc()).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order


@router.post("", response_model=OrderResponse)
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        items = [item.model_dump() for item in order.items]
        total = sum(i["quantity"] * i["unit_price"] for i in items)
        order_number = get_next_order_number(db)

        db_order = Order(
            order_number=order_number,
            items=items,
            total_price=total,
            status="pending",
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)

        try:
            await dispatch_event("order.created", {
                "order_id": db_order.id,
                "order_number": db_order.order_number,
                "items": items,
                "total_price": total,
                "status": "pending",
            }, db=db)
        except Exception as e:
            print(f"WebSocket dispatch error: {e}")

        return db_order
    except Exception as e:
        print(f"Create order error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(order_id: int, update: OrderStatusUpdate, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    valid = ["preparing", "completed", "cancelled"]
    if update.status not in valid:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid}")

    db_order.status = update.status
    db.commit()
    db.refresh(db_order)

    event = f"order.{update.status}"
    await dispatch_event(event, {
        "order_id": db_order.id,
        "order_number": db_order.order_number,
        "status": update.status,
        "items": db_order.items,
        "total_price": db_order.total_price,
    }, db=db)

    return db_order
