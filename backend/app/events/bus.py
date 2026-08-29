import logging
import time
from typing import Any, Dict
from app.websocket.manager import manager

logger = logging.getLogger(__name__)

EVENT_CHANNELS = {
    "order.created":   ["owner", "dev"],
    "order.preparing": ["customer", "dev"],
    "order.completed": ["customer", "dev"],
    "order.cancelled": ["customer", "dev"],
    "menu.updated":    ["customer", "dev"],
}


async def dispatch_event(event_type: str, payload: Dict[str, Any], db=None):
    """Dispatch an event to relevant WebSocket channels and log to DB."""
    start = time.time()

    message = {"event": event_type, **payload}

    channels = EVENT_CHANNELS.get(event_type, ["dev"])
    for channel in channels:
        await manager.broadcast_to_channel(channel, message)

    latency_ms = (time.time() - start) * 1000

    if db is not None:
        try:
            from app.models.webhook_log import WebhookLog
            log = WebhookLog(
                event_type=event_type,
                payload=payload,
                direction="ws_broadcast",
                latency_ms=latency_ms,
            )
            db.add(log)
            db.commit()
        except Exception:
            # Logging must never break event delivery, but a swallowed
            # traceback once hid a schema mismatch for the whole log table.
            logger.exception("Failed to persist event log: %s", event_type)
            db.rollback()
