import logging
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.webhook_log import WebhookLog
from app.schemas.log import WebhookLogResponse
from app.websocket.manager import manager

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/logs", tags=["logs"])


@router.get("", response_model=List[WebhookLogResponse])
def get_logs(
    event_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    # No try/except: an empty list and a broken query must not look identical.
    # A real failure should surface as a 500, not as "no events yet".
    query = db.query(WebhookLog)
    if event_type:
        query = query.filter(WebhookLog.event_type == event_type)
    return query.order_by(WebhookLog.created_at.desc()).offset(skip).limit(limit).all()


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
    except Exception:
        # Degrade to connection counts only, but make the cause visible.
        logger.exception("Failed to aggregate event counts")
        return {
            "event_counts": {},
            "connections": manager.get_connection_counts(),
        }
