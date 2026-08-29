from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MenuBase(BaseModel):
    name: str
    name_en: str
    price: int
    category: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_available: bool = True


class MenuCreate(MenuBase):
    pass


class MenuUpdate(BaseModel):
    name: Optional[str] = None
    name_en: Optional[str] = None
    price: Optional[int] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None


class MenuResponse(MenuBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
