/**
 * ParkEase AI — Slot Service
 * Frontend API wrapper for slot availability and Digital Twin initial state.
 */
import { ApiClient } from '../lib/api-client';
import type { SlotWithAvailability, DigitalTwinState } from '../types/models';

export interface SlotAvailabilityParams {
  facility_id: string;
  floor_id?: string;
  start_time: string;   // ISO 8601 UTC
  end_time: string;     // ISO 8601 UTC
  slot_type?: string;
  vehicle_type?: string;
}

export const SlotService = {
  /** Query available slots with rich filters. Returns slots with isBookable flag mapped from API. */
  getAvailableSlots: async (params: SlotAvailabilityParams): Promise<SlotWithAvailability[]> => {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.set(key, val);
        }
      });

      const rawList = await ApiClient.get<any[]>(`/slots/available?${searchParams.toString()}`);

      return rawList.map((s: any) => ({
        id: s.id,
        name: s.name,
        type: s.type,
        status: s.status,
        pricePerHour: s.price_per_hour ?? s.pricePerHour,
        x: s.x,
        y: s.y,
        w: s.w,
        h: s.h,
        floorId: s.floor_id ?? s.floorId,
        floorName: s.floor_name ?? s.floorName ?? '',
        isBookable: s.is_bookable ?? s.isBookable ?? true,
      }));
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError' || err.message?.includes('fetch')) {
        console.warn('Backend API offline. Generating mock available slots.');
        return Array.from({ length: 16 }, (_, i) => ({
          id: `slot-${i + 1}`,
          name: `A-${101 + i}`,
          type: 'STANDARD',
          status: 'AVAILABLE',
          pricePerHour: 30,
          x: (i % 4) * 60,
          y: Math.floor(i / 4) * 90,
          w: 50,
          h: 80,
          floorId: 'fl-1',
          floorName: 'Level 1',
          isBookable: i !== 3 && i !== 7,
        }));
      }
      throw err;
    }
  },

  /** Get Digital Twin initial state via REST (instant page load). */
  getSlotTwin: (slotId: string, bookingId: string): Promise<DigitalTwinState> =>
    ApiClient.get<DigitalTwinState>(`/slots/${slotId}/twin?booking_id=${bookingId}`),
};
