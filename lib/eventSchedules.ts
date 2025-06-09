import { create } from "zustand";
import { EventSchedule } from "@/types";
import { eventScheduleService } from "@/services/eventSchedules";

export interface eventScheduleQueryParams {
  date?: string;
  companyId?: string;
  eventId?: string;
}

interface EventScheduleState {
  schedules: EventSchedule[];
  selectedSchedule: EventSchedule | null;
  isLoading: boolean;
  error: string | null;
  getSchedules: (params?: eventScheduleQueryParams) => Promise<void>;
  getScheduleById: (id: string) => Promise<void>;
  createSchedule: (schedule: Omit<EventSchedule, "id">) => Promise<void>;
  updateSchedule: (
    id: string,
    schedule: Partial<EventSchedule>
  ) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  selectSchedule: (schedule: EventSchedule | null) => void;
  clearError: () => void;
}

export const useEventScheduleStore = create<EventScheduleState>((set, get) => ({
  schedules: [],
  selectedSchedule: null,
  isLoading: false,
  error: null,

  getSchedules: async (params?: eventScheduleQueryParams) => {
    try {
      set({ isLoading: true, error: null });
      const schedules = await eventScheduleService.getEventSchedules(params);
      console.log(schedules, " asdasdasdsadad");
      set({ schedules, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch schedules",
        isLoading: false,
      });
    }
  },

  getScheduleById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const schedule = await eventScheduleService.getEventScheduleById(id);
      set({ selectedSchedule: schedule, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch schedule",
        isLoading: false,
      });
    }
  },

  createSchedule: async (schedule: Omit<EventSchedule, "_id">) => {
    try {
      set({ isLoading: true, error: null });
      const newSchedule = await eventScheduleService.createEventSchedule(
        schedule
      );
      set((state) => ({
        schedules: [...state.schedules, newSchedule],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create schedule",
        isLoading: false,
      });
    }
  },

  updateSchedule: async (id: string, schedule: Partial<EventSchedule>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedSchedule = await eventScheduleService.updateEventSchedule(
        id,
        schedule
      );
      set((state) => ({
        schedules: state.schedules.map((s) =>
          s.id === id ? updatedSchedule : s
        ),
        selectedSchedule:
          state.selectedSchedule?.id === id
            ? updatedSchedule
            : state.selectedSchedule,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update schedule",
        isLoading: false,
      });
    }
  },

  deleteSchedule: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await eventScheduleService.deleteEventSchedule(id);
      set((state) => ({
        schedules: state.schedules.filter((s) => s.id !== id),
        selectedSchedule:
          state.selectedSchedule?.id === id ? null : state.selectedSchedule,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete schedule",
        isLoading: false,
      });
    }
  },

  selectSchedule: (schedule: EventSchedule | null) => {
    set({ selectedSchedule: schedule });
  },

  clearError: () => {
    set({ error: null });
  },
}));
