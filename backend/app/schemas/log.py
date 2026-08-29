from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class WebhookLogResponse(BaseModel):
    id: int
    event_type: str
    payload: Any
    direction: str
    latency_ms: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True
