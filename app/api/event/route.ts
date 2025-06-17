import { NextResponse } from 'next/server';
import { eventDB } from '@/lib/db';

// GET /api/users - Get all users
export async function GET() {
  try {
    const events = eventDB.getAll();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const eventData = await request.json();
    const newEvent = eventDB.create(eventData);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
} 