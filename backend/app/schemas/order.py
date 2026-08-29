from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class OrderItem(BaseModel):
    menu_id: int
    name: str
    quantity: int
    unit_price: int


class OrderCreate(BaseModel):
    items: List[OrderItem]


class OrderStatusUpdate(BaseModel):
    status: str


class OrderResponse(BaseModel):
    id: int
    order_number: int
    items: Any
    total_price: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
