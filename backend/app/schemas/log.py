from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class WebhookLogResponse(BaseModel):
    id: int
    event_type: str
    payload: Any
    # Legacy rows predate these columns, so both are genuinely absent there.
    direction: Optional[str] = None
    latency_ms: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
