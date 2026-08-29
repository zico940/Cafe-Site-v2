from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.webhook_log import WebhookLog
from app.schemas.log import WebhookLogResponse
from app.websocket.manager import manager

router = APIRouter(prefix="/api/logs", tags=["logs"])


@router.get("", response_model=List[WebhookLogResponse])
def get_logs(
    event_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    try:
        query = db.query(WebhookLog)
        if event_type:
            query = query.filter(WebhookLog.event_type == event_type)
        return query.order_by(WebhookLog.created_at.desc()).offset(skip).limit(limit).all()
    except Exception as e:
        print(f"Error fetching logs: {e}")
        return []


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    from sqlalchemy import func
    try:
        counts = (
            db.query(WebhookLog.event_type, func.count(WebhookLog.id))
            .group_by(WebhookLog.event_type)
            .all()
        )
        return {
            "event_counts": dict(counts),
            "connections": manager.get_connection_counts(),
        }
    except Exception as e:
        print(f"Error fetching stats: {e}")
        return {
            "event_counts": {},
            "connections": manager.get_connection_counts(),
        }
