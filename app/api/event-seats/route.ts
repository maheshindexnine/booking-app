import { NextResponse } from "next/server";
import { eventSeatDB } from "@/lib/db";

// GET /api/event-seats - Get all event-seats
export async function GET() {
  try {
    const eventSeats = eventSeatDB.getAll();
    return NextResponse.json(eventSeats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch event-seats" },
      { status: 500 }
    );
  }
}

// POST /api/event-seat - Create a new event-seat
export async function POST(request: Request) {
  try {
    const eventSeatData = await request.json();
    const newEventSeat = eventSeatDB.create(eventSeatData);
    return NextResponse.json(newEventSeat, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event-seat" },
      { status: 500 }
    );
  }
}
