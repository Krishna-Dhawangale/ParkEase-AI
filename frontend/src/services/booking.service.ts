/**
 * ParkEase AI — Booking Service
 * Frontend API wrapper for booking lifecycle operations.
 * Maps backend snake_case JSON fields to camelCase TypeScript model.
 */
import { ApiClient } from '../lib/api-client';
import type { Booking, MyBookingsData, BookingCreatePayload } from '../types/models';

function mapBooking(b: any): Booking {
  if (!b) return b;
  return {
    id: b.id,
    facilityId: b.facility_id ?? b.facilityId,
    facilityName: b.facility_name ?? b.facilityName ?? '',
    floorId: b.floor_id ?? b.floorId,
    floorName: b.floor_name ?? b.floorName ?? '',
    slotId: b.slot_id ?? b.slotId,
    slotName: b.slot_name ?? b.slotName ?? '',
    vehicleId: b.vehicle_id ?? b.vehicleId,
    vehiclePlate: b.vehicle_plate ?? b.vehiclePlate ?? '',
    startTime: b.start_time ?? b.startTime ?? '',
    endTime: b.end_time ?? b.endTime ?? '',
    totalAmount: b.total_amount ?? b.totalAmount ?? 0,
    currency: b.currency ?? 'INR',
    status: b.status,
    qrCodeToken: b.qr_code_token ?? b.qrCodeToken,
    isActive: b.is_active ?? b.isActive ?? false,
    paymentExpiresAt: b.payment_expires_at ?? b.paymentExpiresAt,
    createdAt: b.created_at ?? b.createdAt ?? '',
  };
}

const MOCK_BOOKINGS_STORAGE_KEY = 'parkease-mock-bookings-list';

function getLocalBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(MOCK_BOOKINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBookings(list: Booking[]): void {
  try {
    localStorage.setItem(MOCK_BOOKINGS_STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export const BookingService = {
  /** Create a booking (→ PENDING_PAYMENT with 5-min TTL). */
  createBooking: async (data: BookingCreatePayload): Promise<Booking> => {
    try {
      const raw = await ApiClient.post<any>('/bookings/', data);
      return mapBooking(raw);
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError' || err.message?.includes('fetch')) {
        console.warn('Backend API offline. Creating local mock booking.');
        const newBooking: Booking = {
          id: `bk_${Date.now()}`,
          facilityId: data.facility_id,
          facilityName: 'Parking Facility',
          floorId: data.floor_id,
          floorName: 'Floor 1',
          slotId: data.slot_id,
          slotName: 'Slot A-101',
          vehicleId: data.vehicle_id,
          vehiclePlate: 'MH 40 GD 3868',
          startTime: data.start_time,
          endTime: data.end_time,
          totalAmount: 65.00,
          currency: 'INR',
          status: 'PENDING_PAYMENT',
          qrCodeToken: `QR_PARKEASE_${Date.now()}`,
          isActive: true,
          paymentExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
        };

        const existing = getLocalBookings();
        saveLocalBookings([newBooking, ...existing]);
        return newBooking;
      }
      throw err;
    }
  },

  /** Confirm booking after payment (→ CONFIRMED, generates QR). */
  confirmBooking: async (bookingId: string): Promise<Booking> => {
    try {
      const raw = await ApiClient.post<any>(`/bookings/${bookingId}/confirm`, {});
      return mapBooking(raw);
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError' || err.message?.includes('fetch')) {
        console.warn('Backend API offline. Confirming local mock booking.');
        const list = getLocalBookings();
        const found = list.find(b => b.id === bookingId);

        const updated: Booking = {
          id: bookingId,
          facilityId: found?.facilityId || 'f-1',
          facilityName: found?.facilityName || 'Parking Facility',
          floorId: found?.floorId || 'fl-1',
          floorName: found?.floorName || 'Floor 1',
          slotId: found?.slotId || 'sl-1',
          slotName: found?.slotName || 'Slot A-101',
          vehicleId: found?.vehicleId || 'v-1',
          vehiclePlate: found?.vehiclePlate || 'MH 40 GD 3868',
          startTime: found?.startTime || new Date().toISOString(),
          endTime: found?.endTime || new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
          totalAmount: found?.totalAmount || 65.00,
          currency: 'INR',
          status: 'CONFIRMED',
          qrCodeToken: `PARKEASE_TICKET_${bookingId}`,
          isActive: true,
          paymentExpiresAt: undefined,
          createdAt: found?.createdAt || new Date().toISOString(),
        };

        saveLocalBookings(list.map(b => b.id === bookingId ? updated : b));
        return updated;
      }
      throw err;
    }
  },

  /** Fetch authenticated user's bookings, categorized as active/past/cancelled. */
  getMyBookings: async (): Promise<MyBookingsData> => {
    try {
      const raw = await ApiClient.get<any>('/bookings/my-bookings');
      return {
        active: (raw.active || []).map(mapBooking),
        past: (raw.past || []).map(mapBooking),
        cancelled: (raw.cancelled || []).map(mapBooking),
      };
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError' || err.message?.includes('fetch')) {
        const list = getLocalBookings();
        const now = Date.now();
        // Re-compute isActive based on current time — bookings whose endTime
        // has passed are no longer active, regardless of stored status.
        const enriched = list.map(b => ({
          ...b,
          isActive: (b.status === 'CONFIRMED' || b.status === 'ACTIVE') && new Date(b.endTime).getTime() > now,
        }));
        return {
          active: enriched.filter(b => b.isActive && (b.status === 'CONFIRMED' || b.status === 'PENDING_PAYMENT' || b.status === 'ACTIVE')),
          past: enriched.filter(b => (b.status === 'COMPLETED') || (!b.isActive && (b.status === 'CONFIRMED' || b.status === 'ACTIVE'))),
          cancelled: enriched.filter(b => b.status === 'CANCELLED'),
        };
      }
      throw err;
    }
  },

  /** Get a single booking by ID. */
  getBooking: async (bookingId: string): Promise<Booking> => {
    try {
      const raw = await ApiClient.get<any>(`/bookings/${bookingId}`);
      return mapBooking(raw);
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError' || err.message?.includes('fetch')) {
        const list = getLocalBookings();
        const found = list.find(b => b.id === bookingId);
        if (found) return found;
      }
      throw err;
    }
  },

  /** Cancel a booking with an optional reason. */
  cancelBooking: async (bookingId: string, reason: string = 'User cancelled'): Promise<Booking> => {
    try {
      const raw = await ApiClient.post<any>(`/bookings/${bookingId}/cancel`, { reason });
      return mapBooking(raw);
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError' || err.message?.includes('fetch')) {
        const list = getLocalBookings();
        const found = list.find(b => b.id === bookingId);
        const cancelledBooking: Booking = {
          ...(found || {
            id: bookingId,
            facilityId: 'f-1',
            facilityName: 'Parking Facility',
            floorId: 'fl-1',
            floorName: 'Floor 1',
            slotId: 'sl-1',
            slotName: 'Slot A-101',
            vehicleId: 'v-1',
            vehiclePlate: 'MH 40 GD 3868',
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            totalAmount: 65.00,
            currency: 'INR',
            isActive: false,
            createdAt: new Date().toISOString(),
          }),
          status: 'CANCELLED',
          isActive: false,
        };
        saveLocalBookings(list.map(b => b.id === bookingId ? cancelledBooking : b));
        return cancelledBooking;
      }
      throw err;
    }
  },
};
