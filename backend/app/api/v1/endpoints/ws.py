from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_manager import manager

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, facility_id: str = "global"):
    await manager.connect(websocket, facility_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back or handle client heartbeats
            await websocket.send_text(f"Ack: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, facility_id)
