import fs from "fs";
import path from "path";
import { User, Company, EventSchedule, Seat, Movie, EventSeat } from "@/types";

const dbPath = path.join(process.cwd(), "db.json");

// Read database
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { users: [], companies: [] };
  }
};

// Write to database
const writeDB = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// User operations
export const userDB = {
  getAll: (): User[] => {
    const db = readDB();
    return db.users;
  },

  getById: (id: string): User | undefined => {
    const db = readDB();
    return db.users.find((user: User) => user._id === id);
  },

  create: (userData: Omit<User, "_id" | "createdAt" | "updatedAt">): User => {
    const db = readDB();
    const newUser: User = {
      ...userData,
      _id: String(db.users.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    writeDB(db);
    return newUser;
  },

  update: (id: string, userData: Partial<User>): User | undefined => {
    const db = readDB();
    const userIndex = db.users.findIndex((user: User) => user._id === id);
    if (userIndex === -1) return undefined;

    db.users[userIndex] = {
      ...db.users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);
    return db.users[userIndex];
  },

  delete: (id: string): boolean => {
    const db = readDB();
    const userIndex = db.users.findIndex((user: User) => user._id === id);
    if (userIndex === -1) return false;

    db.users.splice(userIndex, 1);
    writeDB(db);
    return true;
  },
};

// Company operations
export const companyDB = {
  getAll: (): Company[] => {
    const db = readDB();
    return db.companies;
  },

  getById: (id: string): Company | undefined => {
    const db = readDB();
    return db.companies.find((company: Company) => company._id === id);
  },

  create: (companyData: Omit<Company, "_id">): Company => {
    const db = readDB();
    const newCompany: Company = {
      ...companyData,
      _id: String(db.companies.length + 1),
    };
    db.companies.push(newCompany);
    writeDB(db);
    return newCompany;
  },

  update: (id: string, companyData: Partial<Company>): Company | undefined => {
    const db = readDB();
    const companyIndex = db.companies.findIndex(
      (company: Company) => company._id === id
    );
    if (companyIndex === -1) return undefined;

    db.companies[companyIndex] = {
      ...db.companies[companyIndex],
      ...companyData,
    };
    writeDB(db);
    return db.companies[companyIndex];
  },

  delete: (id: string): boolean => {
    const db = readDB();
    const companyIndex = db.companies.findIndex(
      (company: Company) => company._id === id
    );
    if (companyIndex === -1) return false;

    db.companies.splice(companyIndex, 1);
    writeDB(db);
    return true;
  },
};

// Event operations
export const eventDB = {
  getAll: (): Movie[] => {
    const db = readDB();
    return db.events;
  },

  getById: (id: string): Movie | undefined => {
    const db = readDB();
    return db.events.find((event: Movie) => event._id === id);
  },

  create: (
    userData: Omit<Movie, "_id" | "createdAt" | "updatedAt">
  ): Movie => {
    const db = readDB();
    const newEvent: Movie = {
      ...userData,
      _id: String(db.events.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.events.push(newEvent);
    writeDB(db);
    return newEvent;
  },

  update: (
    id: string,
    eventData: Partial<Movie>
  ): Movie | undefined => {
    const db = readDB();
    const eventIndex = db.events.findIndex(
      (event: Movie) => event._id === id
    );
    if (eventIndex === -1) return undefined;

    db.events[eventIndex] = {
      ...db.events[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);
    return db.events[eventIndex];
  },

  delete: (id: string): boolean => {
    const db = readDB();
    const eventIndex = db.events.findIndex(
      (event: Movie) => event._id === id
    );
    if (eventIndex === -1) return false;

    db.events.splice(eventIndex, 1);
    writeDB(db);
    return true;
  },
};

// EventSchedule operations
export const eventScheduleDB = {
  getAll: (): EventSchedule[] => {
    const db = readDB();
    return db.eventSchedules;
  },

  getById: (id: string): EventSchedule | undefined => {
    const db = readDB();
    return db.eventSchedules.find((event: EventSchedule) => event._id === id);
  },

  create: (
    userData: Omit<EventSchedule, "_id" | "createdAt" | "updatedAt">
  ): EventSchedule => {
    const db = readDB();
    const newEvent: EventSchedule = {
      ...userData,
      _id: String(db.eventSchedules.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.eventSchedules.push(newEvent);
    writeDB(db);
    return newEvent;
  },

  update: (
    id: string,
    eventData: Partial<EventSchedule>
  ): EventSchedule | undefined => {
    const db = readDB();
    const eventIndex = db.eventSchedules.findIndex(
      (event: EventSchedule) => event._id === id
    );
    if (eventIndex === -1) return undefined;

    db.eventSchedules[eventIndex] = {
      ...db.eventSchedules[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);
    return db.eventSchedules[eventIndex];
  },

  delete: (id: string): boolean => {
    const db = readDB();
    const eventIndex = db.eventSchedules.findIndex(
      (event: EventSchedule) => event._id === id
    );
    if (eventIndex === -1) return false;

    db.eventSchedules.splice(eventIndex, 1);
    writeDB(db);
    return true;
  },
};

// EventSeat operations
export const eventSeatDB = {
  getAll: (): EventSeat[] => {
    const db = readDB();
    return db.eventSeats;
  },

  getById: (id: string): EventSeat | undefined => {
    const db = readDB();
    return db.eventSeats.find((event: EventSeat) => event._id === id);
  },

  create: (
    userData: Omit<EventSeat, "_id" | "createdAt" | "updatedAt">
  ): EventSeat => {
    const db = readDB();
    const newEvent: EventSeat = {
      ...userData,
      _id: String(db.eventSeats.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.eventSeats.push(newEvent);
    writeDB(db);
    return newEvent;
  },

  update: (
    id: string,
    eventData: Partial<EventSeat>
  ): EventSeat | undefined => {
    const db = readDB();
    const eventIndex = db.eventSeats.findIndex(
      (event: EventSeat) => event._id === id
    );
    if (eventIndex === -1) return undefined;

    db.eventSeats[eventIndex] = {
      ...db.eventSeats[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);
    return db.eventSeats[eventIndex];
  },

  delete: (id: string): boolean => {
    const db = readDB();
    const eventIndex = db.eventSeats.findIndex(
      (event: EventSeat) => event._id === id
    );
    if (eventIndex === -1) return false;

    db.eventSeats.splice(eventIndex, 1);
    writeDB(db);
    return true;
  },
};
