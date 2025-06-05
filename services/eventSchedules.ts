import { EventSchedule } from "@/types";

import api from "./api";

export const eventScheduleService = {
  // Create a new event schedule
  createEventSchedule: async (
    eventSchedule: Omit<EventSchedule, "id">
  ): Promise<EventSchedule> => {
    try {
      const response = await api.post("/event-schedules", eventSchedule);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all event schedules
  getEventSchedules: async (): Promise<EventSchedule[]> => {
    try {
      const response = await api.get("/event-schedules");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get event schedule by ID
  getEventScheduleById: async (id: string): Promise<EventSchedule> => {
    try {
      const response = await api.get(`/event-schedules/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update event schedule
  updateEventSchedule: async (
    id: string,
    eventSchedule: Partial<EventSchedule>
  ): Promise<EventSchedule> => {
    try {
      const response = await api.put(`/event-schedules/${id}`, eventSchedule);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete event schedule
  deleteEventSchedule: async (id: string): Promise<void> => {
    try {
      await api.delete(`/event-schedules/${id}`);
    } catch (error) {
      throw error;
    }
  },
};
