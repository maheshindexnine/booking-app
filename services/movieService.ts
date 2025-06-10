import { Movie } from "@/types";
import api from "./api";

// API calls
export const movieService = {
  // Get all movies
  getMovies: async (): Promise<Movie[]> => {
    try {
      const response = await api.get("/event");
      return response.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  },

  // Create a new movie
  createMovie: async (
    movieData: Omit<Movie, "id" | "createdAt">
  ): Promise<Movie> => {
    try {
      const response = await api.post("/event", movieData);
      return response.data;
    } catch (error) {
      console.error("Error creating movie:", error);
      throw error;
    }
  },

  getMovieById: async (id: string): Promise<Movie> => {
    try {
      const response = await api.get(`/event/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching movie:", error);
      throw error;
    }
  },

  updateMovieById: async (
    id: string,
    movieData: Partial<Movie>
  ): Promise<Movie> => {
    try {
      const response = await api.put(`/event/${id}`, movieData);
      return response.data;
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;
    }
  },

  deleteMovieById: async (id: string): Promise<Movie> => {
    try {
      const response = await api.delete(`/event/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw error;
    }
  },
};
