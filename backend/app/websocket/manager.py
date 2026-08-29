from fastapi import WebSocket
from typing import List, Dict
import json


class ConnectionManager:
    def __init__(self):
        self.connections: Dict[str, List[WebSocket]] = {
            "customer": [],
            "owner": [],
            "dev": [],
        }

    async def connect(self, websocket: WebSocket, channel: str):
        await websocket.accept()
        if channel not in self.connections:
            self.connections[channel] = []
        self.connections[channel].append(websocket)

    def disconnect(self, websocket: WebSocket, channel: str):
        if channel in self.connections:
            try:
                self.connections[channel].remove(websocket)
            except ValueError:
                pass

    async def broadcast_to_channel(self, channel: str, message: dict):
        if channel not in self.connections:
            return
        dead = []
        for ws in self.connections[channel]:
            try:
                await ws.send_text(json.dumps(message, ensure_ascii=False, default=str))
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws, channel)

    async def broadcast_to_all(self, message: dict):
        for channel in self.connections:
            await self.broadcast_to_channel(channel, message)

    def get_connection_counts(self) -> Dict[str, int]:
        return {ch: len(conns) for ch, conns in self.connections.items()}


manager = ConnectionManager()
