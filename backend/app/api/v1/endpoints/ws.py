"""
ParkEase AI — WebSocket Endpoint
Handles facility broadcasts and Digital Twin live telemetry subscriptions.
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_manager import manager
from app.services.digital_twin_service import DigitalTwinService
from app.core.config import settings
import asyncio
import json
import logging

router = APIRouter()
logger = logging.getLogger(__name__)
twin_service = DigitalTwinService()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, facility_id: str = "global"):
    await manager.connect(websocket, facility_id)
    twin_task = None  # Background task for Digital Twin updates
    subscribed_slot_id = None

    try:
        while True:
            raw = await websocket.receive_text()

            # Try to parse as JSON for structured commands
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                await websocket.send_text(f"Ack: {raw}")
                continue

            msg_type = data.get("type", "")

            if msg_type == "SUBSCRIBE_DIGITAL_TWIN":
                slot_id = data.get("slot_id")
                booking_id = data.get("booking_id")

                if not slot_id or not booking_id:
                    await websocket.send_json({
                        "type": "ERROR",
                        "message": "slot_id and booking_id are required",
                    })
                    continue

                # Cancel any existing twin subscription
                if twin_task and not twin_task.done():
                    twin_task.cancel()

                subscribed_slot_id = slot_id
                logger.info(f"TwinSubscribed: slot={slot_id} booking={booking_id}")

                # Start pushing live telemetry at configured interval
                async def push_twin_updates(sid: str):
                    try:
                        while True:
                            update = await twin_service.get_live_update(sid)
                            await websocket.send_json(update)
                            await asyncio.sleep(settings.TWIN_WS_PUSH_INTERVAL_SECONDS)
                    except asyncio.CancelledError:
                        logger.info(f"TwinUnsubscribed: slot={sid}")
                    except Exception as e:
                        logger.error(f"Twin push error: {e}")

                twin_task = asyncio.create_task(push_twin_updates(slot_id))

            elif msg_type == "UNSUBSCRIBE_DIGITAL_TWIN":
                if twin_task and not twin_task.done():
                    twin_task.cancel()
                    twin_task = None
                    subscribed_slot_id = None
                logger.info("TwinClosed: client unsubscribed")
                await websocket.send_json({
                    "type": "TWIN_UNSUBSCRIBED",
                    "message": "Digital Twin stream stopped",
                })

            elif msg_type == "PING":
                await websocket.send_json({"type": "PONG"})

            else:
                # Echo fallback for other messages
                await websocket.send_text(f"Ack: {raw}")

    except WebSocketDisconnect:
        if twin_task and not twin_task.done():
            twin_task.cancel()
        manager.disconnect(websocket, facility_id)
