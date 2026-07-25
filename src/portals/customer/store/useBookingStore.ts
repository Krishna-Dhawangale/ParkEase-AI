import { create } from 'zustand';

export type SlotState = 'AVAILABLE' | 'HELD' | 'RESERVED' | 'OCCUPIED';

interface BookingState {
  // Real-time hold mechanism
  selectedSlotId: string | null;
  heldUntil: number | null; // Timestamp when hold expires (e.g., Date.now() + 5 mins)
  
  // Actions
  selectSlot: (slotId: string) => boolean; // Returns true if successfully held
  releaseSlot: () => void;
  confirmBooking: () => void;
  
  // Status check
  isSlotHeld: (slotId: string) => boolean;
}

// 5 minutes in milliseconds
const HOLD_DURATION = 5 * 60 * 1000;

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedSlotId: null,
  heldUntil: null,
  
  selectSlot: (slotId: string) => {
    // Check if another slot is already held and if the hold is still valid
    const state = get();
    const now = Date.now();
    
    if (state.selectedSlotId && state.heldUntil && state.heldUntil > now) {
      // If holding another slot, release it first (optional logic)
      if (state.selectedSlotId !== slotId) {
        set({ selectedSlotId: slotId, heldUntil: now + HOLD_DURATION });
        return true;
      }
      return false; // Already holding this slot
    }
    
    // Hold the new slot
    set({ selectedSlotId: slotId, heldUntil: now + HOLD_DURATION });
    return true;
  },
  
  releaseSlot: () => {
    set({ selectedSlotId: null, heldUntil: null });
  },
  
  confirmBooking: () => {
    // In a real app, this would hit an API to transition HELD to RESERVED
    // For now, we just clear the temporary hold state as the booking is finalized
    set({ selectedSlotId: null, heldUntil: null });
  },
  
  isSlotHeld: (slotId: string) => {
    const state = get();
    const now = Date.now();
    return state.selectedSlotId === slotId && state.heldUntil !== null && state.heldUntil > now;
  },
}));
