"""
ParkEase AI — Pricing Service
Decoupled pricing calculation. MVP: price_per_hour × ceil(hours).
Designed for future extension: peak, daily, weekend, holiday, membership, coupon rules.
"""
import math
from datetime import datetime
from typing import Optional


class PricingService:
    """
    Calculate booking cost from slot rate and time window.
    Future: inject pricing rules from DB, apply surge multipliers, membership discounts.
    """

    @staticmethod
    def calculate_amount(
        price_per_hour: Optional[float],
        start_time: datetime,
        end_time: datetime,
        base_facility_rate: float = 30.0,
    ) -> float:
        """
        Calculate total booking amount.

        Args:
            price_per_hour: Slot-specific rate (overrides facility rate if set).
            start_time: Booking start (UTC).
            end_time: Booking end (UTC).
            base_facility_rate: Fallback rate from the facility.

        Returns:
            Total amount rounded to 2 decimal places.
        """
        rate = price_per_hour if price_per_hour is not None else base_facility_rate

        duration_seconds = (end_time - start_time).total_seconds()
        duration_hours = duration_seconds / 3600.0

        # Minimum 30 minutes = 0.5 hours
        billable_hours = max(math.ceil(duration_hours * 2) / 2, 0.5)

        total = round(rate * billable_hours, 2)
        return total
