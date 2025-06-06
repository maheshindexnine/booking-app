export type UserRole = 'admin' | 'vendor' | 'user';

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
  type: 'movie';
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
  name: string;
  capacity: number;
  price?: number;
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
  type: 'movie';
  description: string;
  genre: string[];
}

export interface EventSchedule {
  _id?: string;
  userId: string;
  companyId?: CompanyId | string;
  eventId?: Movie | string;
  date: string;
  seatTypes: SeatType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SeatType {
  name: string;
  price: number;
  capacity: number;
}

export interface EventSeat {
  id: string;
  eventScheduleId: string;
  seatType: string;
  row: string;
  number: number;
  status: 'available' | 'reserved' | 'booked';
}

export interface Booking {
  id: string;
  userId: string;
  eventScheduleId: string;
  seats: string[]; // Array of EventSeat IDs
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}