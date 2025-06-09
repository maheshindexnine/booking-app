import { create } from "zustand";
import { Movie, EventSchedule, EventSeat, Company, Booking } from "@/types";
import { movieService } from "@/services/movieService";

// Mock data - Export this directly for static generation
export const mockMovies: Movie[] = [
  {
    id: "1",
    name: "Inception",
    type: "movie",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genre: ["Action", "Sci-Fi", "Thriller"],
    duration: 148,
    image: "https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg",
    userId: "1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "The Shawshank Redemption",
    type: "movie",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    genre: ["Drama"],
    duration: 142,
    image: "https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg",
    userId: "1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "The Dark Knight",
    type: "movie",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: ["Action", "Crime", "Drama"],
    duration: 152,
    image: "https://images.pexels.com/photos/65128/pexels-photo-65128.jpeg",
    userId: "1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Pulp Fiction",
    type: "movie",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    genre: ["Crime", "Drama"],
    duration: 154,
    image: "https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg",
    userId: "1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "The Matrix",
    type: "movie",
    description:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    genre: ["Action", "Sci-Fi"],
    duration: 136,
    image: "https://images.pexels.com/photos/4145069/pexels-photo-4145069.jpeg",
    userId: "1",
    createdAt: new Date().toISOString(),
  },
];

const mockCompanies: Company[] = [
  {
    id: "1",
    userId: "2",
    name: "Cineverse Theaters",
    seats: [
      { name: "Standard", capacity: 120 },
      { name: "Premium", capacity: 40 },
      { name: "VIP", capacity: 10 },
    ],
  },
  {
    id: "2",
    userId: "2",
    name: "Starlight Cinema",
    seats: [
      { name: "Regular", capacity: 100 },
      { name: "Deluxe", capacity: 30 },
      { name: "Elite", capacity: 15 },
    ],
  },
];

const mockSchedules: EventSchedule[] = [
  {
    id: "1",
    userId: "2",
    companyId: "1",
    eventId: "1", // Inception
    date: "2025-06-04",
    time: "19:00",
    seatTypes: [
      { name: "Standard", price: 10, capacity: 120 },
      { name: "Premium", price: 15, capacity: 40 },
      { name: "VIP", price: 25, capacity: 10 },
    ],
  },
  {
    id: "2",
    userId: "2",
    companyId: "1",
    eventId: "3", // The Dark Knight
    date: "2025-06-10",
    time: "21:30",
    seatTypes: [
      { name: "Standard", price: 10, capacity: 120 },
      { name: "Premium", price: 15, capacity: 40 },
      { name: "VIP", price: 25, capacity: 10 },
    ],
  },
  {
    id: "3",
    userId: "2",
    companyId: "2",
    eventId: "2", // Shawshank
    date: "2025-06-05",
    time: "18:00",
    seatTypes: [
      { name: "Regular", price: 9, capacity: 100 },
      { name: "Deluxe", price: 14, capacity: 30 },
      { name: "Elite", price: 22, capacity: 15 },
    ],
  },
];

// Generate mock event seats
const generateMockSeats = (): EventSeat[] => {
  const seats: EventSeat[] = [];
  let seatId = 1;

  // For each schedule
  mockSchedules.forEach((schedule) => {
    // For each seat type in the schedule
    schedule.seatTypes.forEach((seatType) => {
      // Calculate how many rows we need
      const seatsPerRow = 10;
      const numRows = Math.ceil(seatType.capacity / seatsPerRow);

      // Generate row and seat numbers
      for (let row = 0; row < numRows; row++) {
        const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.
        const seatsInThisRow = Math.min(
          seatsPerRow,
          seatType.capacity - row * seatsPerRow
        );

        for (let seatNum = 1; seatNum <= seatsInThisRow; seatNum++) {
          seats.push({
            id: `seat-${seatId++}`,
            eventScheduleId: schedule.id,
            seatType: seatType.name,
            row: rowLetter,
            number: seatNum,
            status: Math.random() > 0.8 ? "booked" : "available", // Randomly mark some seats as booked
          });
        }
      }
    });
  });

  return seats;
};

const mockEventSeats = generateMockSeats();

const mockBookings: Booking[] = [];

// Store
interface MovieState {
  movies: Movie[];
  companies: Company[];
  schedules: EventSchedule[];
  eventSeats: EventSeat[];
  bookings: Booking[];
  selectedMovie: Movie | null;
  selectedSchedule: EventSchedule | null;
  selectedSeats: EventSeat[];

  // Actions
  getMovies: () => Promise<Movie[]>;
  getMovieById: (id: string) => Promise<Movie | undefined>;
  getSchedulesForMovie: (movieId: string) => EventSchedule[];
  getSeatsForSchedule: (scheduleId: string) => EventSeat[];
  selectMovie: (movie: Movie) => void;
  selectSchedule: (schedule: EventSchedule) => void;
  toggleSeatSelection: (seat: EventSeat) => void;
  clearSelectedSeats: () => void;
  createBooking: (userId: string) => Booking;
  getBookingsForUser: (userId: string) => Booking[];
  getCompanyById: (id: string) => Company | undefined;

  // Admin actions
  addMovie: (movie: Omit<Movie, "id" | "createdAt">) => void;
  updateMovie: (id: string, data: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;

  // Vendor actions
  getCompaniesByUserId: (userId: string) => Company[];
  addCompany: (company: Omit<Company, "id">) => void;
  updateCompany: (id: string, data: Partial<Company>) => void;
  addSchedule: (schedule: Omit<EventSchedule, "id">) => void;
}

export const useMovieStore = create<MovieState>((set, get) => ({
  movies: [],
  companies: mockCompanies,
  schedules: mockSchedules,
  eventSeats: mockEventSeats,
  bookings: mockBookings,
  selectedMovie: null,
  selectedSchedule: null,
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

  getSchedulesForMovie: (movieId) =>
    get().schedules.filter((schedule) => schedule.eventId === movieId),

  getSeatsForSchedule: (scheduleId) =>
    get().eventSeats.filter((seat) => seat.eventScheduleId === scheduleId),

  selectMovie: (movie) => set({ selectedMovie: movie }),

  selectSchedule: (schedule) =>
    set({
      selectedSchedule: schedule,
      selectedSeats: [], // Clear selected seats when changing schedule
    }),

  toggleSeatSelection: (seat) => {
    if (seat.status === "booked") return; // Can't select already booked seats

    const { selectedSeats } = get();
    const isSeatSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSeatSelected) {
      set({ selectedSeats: selectedSeats.filter((s) => s.id !== seat.id) });
    } else {
      set({ selectedSeats: [...selectedSeats, seat] });
    }
  },

  clearSelectedSeats: () => set({ selectedSeats: [] }),

  createBooking: (userId) => {
    const { selectedSeats, selectedSchedule, bookings, eventSeats } = get();

    if (!selectedSchedule || selectedSeats.length === 0) {
      throw new Error("No schedule or seats selected");
    }

    // Calculate total amount
    const schedule = get().schedules.find((s) => s.id === selectedSchedule.id);
    if (!schedule) throw new Error("Invalid schedule");

    let totalAmount = 0;
    selectedSeats.forEach((seat) => {
      const seatType = schedule.seatTypes.find(
        (st) => st.name === seat.seatType
      );
      if (seatType) totalAmount += seatType.price;
    });

    // Create booking
    const newBooking: Booking = {
      id: `booking-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      eventScheduleId: selectedSchedule.id,
      seats: selectedSeats.map((seat) => seat.id),
      totalAmount,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Update seats to booked
    const updatedSeats = eventSeats.map((seat) =>
      selectedSeats.some((s) => s.id === seat.id)
        ? { ...seat, status: "booked" as const }
        : seat
    );

    // Update state
    set({
      bookings: [...bookings, newBooking],
      eventSeats: updatedSeats,
      selectedSeats: [], // Clear selection after booking
    });

    return newBooking;
  },

  getBookingsForUser: (userId) =>
    get().bookings.filter((booking) => booking.userId === userId),

  getCompanyById: (id) => get().companies.find((company) => company.id === id),

  // Admin actions
  addMovie: async (movieData) => {
    const newMovie: Movie = {
      ...movieData,
    };

    const response = await movieService.createMovie(newMovie);
    console.log(newMovie, "response");
    get().getMovies();
  },

  updateMovie: (id, data) => {
    const { movies } = get();
    const updatedMovies = movies.map((movie) =>
      movie.id === id ? { ...movie, ...data } : movie
    );

    set({ movies: updatedMovies });
  },

  deleteMovie: (id) => {
    const { movies } = get();
    set({ movies: movies.filter((movie) => movie.id !== id) });
  },

  // Vendor actions
  getCompaniesByUserId: (userId) =>
    get().companies.filter((company) => company.userId === userId),

  addCompany: (companyData) => {
    console.log(companyData, " companyData  ");

    const newCompany: Company = {
      ...companyData,
      id: `company-${Math.random().toString(36).substr(2, 9)}`,
    };
    console.log(newCompany, " sadnajsdn asjkdn ajk wejkew er");

    set({ companies: [...get().companies, newCompany] });
  },

  updateCompany: (id, data) => {
    const { companies } = get();
    const updatedCompanies = companies.map((company) =>
      company.id === id ? { ...company, ...data } : company
    );

    set({ companies: updatedCompanies });
  },

  addSchedule: (scheduleData) => {
    const newSchedule: EventSchedule = {
      ...scheduleData,
      id: `schedule-${Math.random().toString(36).substr(2, 9)}`,
    };

    // Also generate seats for this schedule
    const newSeats: EventSeat[] = [];
    let seatId = get().eventSeats.length + 1;

    // For each seat type
    scheduleData.seatTypes.forEach((seatType) => {
      // Calculate rows and seats
      const seatsPerRow = 10;
      const numRows = Math.ceil(seatType.capacity / seatsPerRow);

      // Generate seats
      for (let row = 0; row < numRows; row++) {
        const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.
        const seatsInThisRow = Math.min(
          seatsPerRow,
          seatType.capacity - row * seatsPerRow
        );

        for (let seatNum = 1; seatNum <= seatsInThisRow; seatNum++) {
          newSeats.push({
            id: `seat-${seatId++}`,
            eventScheduleId: newSchedule.id,
            seatType: seatType.name,
            row: rowLetter,
            number: seatNum,
            status: "available",
          });
        }
      }
    });

    set({
      schedules: [...get().schedules, newSchedule],
      eventSeats: [...get().eventSeats, ...newSeats],
    });
  },
}));
