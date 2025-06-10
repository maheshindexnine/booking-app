import { create } from "zustand";
import { Movie, EventSeat } from "@/types";
import { movieService } from "@/services/movieService";

// Store
interface MovieState {
  movies: Movie[];
  eventSeats: EventSeat[];
  selectedMovie: Movie | null;
  selectedSeats: EventSeat[];

  // Actions
  getMovies: () => Promise<Movie[]>;
  getMovieById: (id: string) => Promise<Movie | undefined>;
  selectMovie: (movie: Movie) => void;
  toggleSeatSelection: (seat: EventSeat) => void;
  clearSelectedSeats: () => void;

  // Admin actions
  addMovie: (movie: Omit<Movie, "id" | "createdAt">) => void;
  updateMovie: (id: string, data: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
}

export const useMovieStore = create<MovieState>((set, get) => ({
  movies: [],
  eventSeats: [],
  selectedMovie: null,
  selectedSeats: [],

  getMovies: async () => {
    try {
      const movies = await movieService.getMovies();
      set({ movies });
      return movies;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return get().movies; // Return existing movies if API call fails
    }
  },

  getMovieById: async (id: string) => {
    try {
      const movie = await movieService.getMovieById(id);
      set({ selectedMovie: movie ?? null });
      return movie;
    } catch (error) {
      console.error("Error fetching movie:", error);
      return undefined;
    }
  },

  addMovie: async (movieData) => {
    const newMovie: Movie = {
      ...movieData,
      rating: 4.3,
    };

    await movieService.createMovie(newMovie);
    get().getMovies();
  },

  updateMovie: (id, data) => {
    movieService.updateMovieById(id, data);
    get().getMovies();
  },

  deleteMovie: (id) => {
    const { movies } = get();
    set({ movies: movies.filter((movie) => movie.id !== id) });
  },

  selectMovie: (movie) => set({ selectedMovie: movie }),

  toggleSeatSelection: (seat) => {
    if (seat.booked) return; // Can't select already booked seats

    const { selectedSeats } = get();
    const isSeatSelected = selectedSeats.some((s) => s._id === seat._id);

    if (isSeatSelected) {
      set({ selectedSeats: selectedSeats.filter((s) => s._id !== seat._id) });
    } else {
      set({ selectedSeats: [...selectedSeats, seat] });
    }
  },

  clearSelectedSeats: () => set({ selectedSeats: [] }),
}));
