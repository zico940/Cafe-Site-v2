from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.menu import Menu
from app.schemas.menu import MenuCreate, MenuUpdate, MenuResponse
from app.events.bus import dispatch_event

router = APIRouter(prefix="/api/menus", tags=["menus"])


@router.get("", response_model=List[MenuResponse])
def get_menus(db: Session = Depends(get_db)):
    return db.query(Menu).all()


@router.post("", response_model=MenuResponse)
async def create_menu(menu: MenuCreate, db: Session = Depends(get_db)):
    db_menu = Menu(**menu.model_dump())
    db.add(db_menu)
    db.commit()
    db.refresh(db_menu)
    await dispatch_event("menu.updated", {"action": "created", "menu_id": db_menu.id})
    return db_menu


@router.put("/{menu_id}", response_model=MenuResponse)
async def update_menu(menu_id: int, menu: MenuUpdate, db: Session = Depends(get_db)):
    db_menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not db_menu:
        raise HTTPException(status_code=404, detail="Menu not found")
    for field, value in menu.model_dump(exclude_unset=True).items():
        setattr(db_menu, field, value)
    db.commit()
    db.refresh(db_menu)
    await dispatch_event("menu.updated", {"action": "updated", "menu_id": menu_id})
    return db_menu


@router.delete("/{menu_id}")
async def delete_menu(menu_id: int, db: Session = Depends(get_db)):
    db_menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not db_menu:
        raise HTTPException(status_code=404, detail="Menu not found")
    db.delete(db_menu)
    db.commit()
    await dispatch_event("menu.updated", {"action": "deleted", "menu_id": menu_id})
    return {"ok": True}


@router.patch("/{menu_id}/availability", response_model=MenuResponse)
async def toggle_availability(menu_id: int, db: Session = Depends(get_db)):
    db_menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not db_menu:
        raise HTTPException(status_code=404, detail="Menu not found")
    db_menu.is_available = not db_menu.is_available
    db.commit()
    db.refresh(db_menu)
    await dispatch_event("menu.updated", {"action": "availability_changed", "menu_id": menu_id, "is_available": db_menu.is_available})
    return db_menu
