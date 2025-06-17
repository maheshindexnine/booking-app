import { NextResponse } from 'next/server';
import { eventScheduleDB } from '@/lib/db';

// GET /api/event-schedule - Get all event-schedules
export async function GET() {
  try {
    const eventSchedules = eventScheduleDB.getAll();
    return NextResponse.json(eventSchedules);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch event-schedules' },
      { status: 500 }
    );
  }
}

// POST /api/event-schedule - Create a new event-schedule
export async function POST(request: Request) {
  try {
    const eventScheduleData = await request.json();
    const newEventSchedule = eventScheduleDB.create(eventScheduleData);
    return NextResponse.json(newEventSchedule, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event-schedule' },
      { status: 500 }
    );
  }
} 