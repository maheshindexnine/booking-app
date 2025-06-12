export type UserRole = "admin" | "vendor" | "user";

export interface Auth {
  _id?: string;
  userId: string;
  access_token: string;
  role?: string;
  type?: string;
  name: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserRole;
  createdAt: string;
}

export interface Movie {
  _id: string;
  id?: string;
  name: string;
  type: "movie";
  description: string;
  genre: string[];
  duration: number; // in minutes
  image: string;
  userId?: string;
  createdAt?: string;
  rating?: number;
}

export interface Company {
  _id: string;
  id?: string;
  userId: string;
  name: string;
  seats: Seat[];
}

export interface Seat {
  capacity: any;
  name: any;
  // id: string;
  // eventId: string;
  // seatNumber: string;
  // status: "available" | "booked";
  // price: number;
  // row: string;
  // section: string;
  // createdAt: string;
  // updatedAt: string;
  _id: string;
  eventScheduleId: string;
  seatName: string;
  row?: string;
  seatNo: number;
  booked: boolean;
  price: number;
}

export interface CompanyId {
  _id: string;
  userId: string;
  name: string;
  seats: Seat[];
}

export interface EventId {
  _id: string;
  name: string;
  type: "movie";
  description: string;
  genre: string[];
}

export interface EventSchedule {
  _id?: string;
  userId: string;
  companyId?: CompanyId | string | any;
  eventId?: Movie | string | any;
  date: string;
  seatTypes: SeatType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SeatType {
  name: string;
  price: number;
  capacity: number;
  color: string;
}

export interface EventSeat {
  _id: string;
  eventScheduleId: string;
  seatName: string;
  row: string;
  seatNo: number;
  booked: boolean;
  price: number;
}

export interface Booking {
  _id: string;
  vendorId: string;
  userId: string;
  companyId: CompanyId;
  eventScheduleId: EventSchedule;
  eventId: Movie;
  seats?: string[]; // Array of EventSeat IDs
  seatNo: string;
  row: string;
  price: number;
  booked: boolean;
  status?: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
