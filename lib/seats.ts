import { create } from 'zustand';
import { Seat } from '@/types';
import { seatService } from '@/services/seatService';
import { BookSeatPayload, SeatQueryParams } from '@/services/seatService';

// Store
interface SeatState {
  seats: Seat[];
  selectedSeat: Seat | null;
  loading: boolean;
  error: string | null;

  // Actions
  getSeats: (params?: SeatQueryParams) => Promise<Seat[]>;
  getSeatById: (id: string) => Seat | undefined;
  selectSeat: (seat: Seat) => void;
  clearSelectedSeat: () => void;
  bookSeat: (payload: BookSeatPayload) => Promise<void>;
  clearError: () => void;
}

export const useSeatStore = create<SeatState>((set, get) => ({
  seats: [],
  selectedSeat: null,
  loading: false,
  error: null,

  // Get all seats
  getSeats: async (params) => {
    try {
      set({ loading: true, error: null });
      const seats = await seatService.getSeats(params);
      set({ seats, loading: false });
      return seats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch seats';
      set({ error: errorMessage, loading: false });
      return get().seats; // Return existing seats if API call fails
    }
  },

  // Get seat by ID
  getSeatById: (id) => get().seats.find(seat => seat.id === id),

  // Select seat
  selectSeat: (seat) => set({ selectedSeat: seat }),

  // Clear selected seat
  clearSelectedSeat: () => set({ selectedSeat: null }),

  // Book a seat
  bookSeat: async (payload) => {
    try {
      set({ loading: true, error: null });
      const updatedSeat = await seatService.bookSeat(payload);
      set(state => ({
        seats: state.seats.map(seat => 
          seat.id === payload.seatId ? updatedSeat : seat
        ),
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to book seat';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
})); 