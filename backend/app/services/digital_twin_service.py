"""
ParkEase AI — Digital Twin Service
TelemetryProvider interface + SimulatorProvider for demo.
No database table — telemetry generated on-the-fly.
"""
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Optional
import random
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class TelemetryProvider(ABC):
    """
    Interface for slot telemetry data.
    Swap SimulatorProvider with MqttProvider / Esp32Provider for real IoT.
    """

    @abstractmethod
    async def get_telemetry(self, slot_id: str) -> dict:
        """Return current telemetry data for a slot."""
        ...


class SimulatorProvider(TelemetryProvider):
    """Demo telemetry — generates randomized but realistic sensor data."""

    async def get_telemetry(self, slot_id: str) -> dict:
        return {
            "sensor_status": random.choice(["ONLINE", "ONLINE", "ONLINE", "OFFLINE"]),  # 75% online
            "occupancy_detected": random.choice([True, False]),
            "battery_level": random.randint(settings.TWIN_BATTERY_MIN, settings.TWIN_BATTERY_MAX),
            "temperature": round(random.uniform(22.0, 35.0), 1),
            "last_updated": datetime.now(timezone.utc).isoformat(),
        }


class DigitalTwinService:
    """Orchestrates Digital Twin data for slots."""

    def __init__(self, provider: Optional[TelemetryProvider] = None):
        self.provider = provider or SimulatorProvider()

    async def get_initial_state(
        self,
        slot_id: str,
        slot_name: str,
        floor_name: str,
        booking_end_time: Optional[datetime] = None,
        vehicle_plate: Optional[str] = None,
    ) -> dict:
        """
        REST GET response — instant page load.
        Returns full twin state including telemetry.
        """
        telemetry = await self.provider.get_telemetry(slot_id)
        logger.info(f"TwinOpened: slot={slot_id}")
        return {
            "slot_id": slot_id,
            "slot_name": slot_name,
            "floor_name": floor_name,
            "status": "RESERVED_FOR_YOU" if booking_end_time else "AVAILABLE",
            "booking_end_time": booking_end_time.isoformat() if booking_end_time else None,
            "vehicle_plate": vehicle_plate,
            **telemetry,
        }

    async def get_live_update(self, slot_id: str) -> dict:
        """
        WebSocket push — incremental update.
        Lighter than full state (no slot name, floor, etc.).
        """
        telemetry = await self.provider.get_telemetry(slot_id)
        return {
            "type": "DIGITAL_TWIN_UPDATE",
            "slot_id": slot_id,
            **telemetry,
        }
