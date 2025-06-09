import { Booking, Seat } from "@/types";
import api from "./api";

export interface BookSeatPayload {
  id: string;
  booked: boolean;
}

export interface SeatQueryParams {
  eventId?: string;
  status?: "available" | "booked";
  section?: string;
  row?: string;
  page?: number;
  limit?: number;
  eventScheduleId?: string;
}

export interface BookingQueryParams {
  eventScheduleId?: string;
  status?: "pending" | "confirmed" | "cancelled";
  page?: number;
  limit?: number;
}

// API calls
export const seatService = {
  // Get all seats with optional query parameters
  getSeats: async (params?: SeatQueryParams): Promise<Seat[]> => {
    try {
      const response = await api.get("/event-seats", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching seats:", error);
      throw error;
    }
  },

  getBookings: async (params?: BookingQueryParams): Promise<Booking[]> => {
    try {
      const response = await api.get("/event-seats/get-bookings", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },

  // Get seat by ID
  getSeatById: async (id: string): Promise<Seat> => {
    try {
      const response = await api.get(`/event-seats/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching seat with id ${id}:`, error);
      throw error;
    }
  },

  // Book a seat
  bookSeat: async (payload: BookSeatPayload): Promise<Seat> => {
    try {
      const response = await api.post("/event-seats/book", payload);
      return response.data;
    } catch (error) {
      console.error("Error booking seat:", error);
      throw error;
    }
  },
};
