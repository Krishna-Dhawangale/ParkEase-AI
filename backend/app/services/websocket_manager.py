from fastapi import WebSocket
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.facility_channels: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, facility_id: str = "global"):
        await websocket.accept()
        self.active_connections.append(websocket)
        if facility_id not in self.facility_channels:
            self.facility_channels[facility_id] = []
        self.facility_channels[facility_id].append(websocket)
        logger.info(f"WebSocket client connected to facility channel: {facility_id}")

    def disconnect(self, websocket: WebSocket, facility_id: str = "global"):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if facility_id in self.facility_channels and websocket in self.facility_channels[facility_id]:
            self.facility_channels[facility_id].remove(websocket)
        logger.info(f"WebSocket client disconnected from facility channel: {facility_id}")

    async def broadcast_to_facility(self, facility_id: str, message: dict):
        connections = self.facility_channels.get(facility_id, [])
        for connection in connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting WebSocket message: {e}")

manager = ConnectionManager()
