import { NextResponse } from 'next/server';
import { User } from '@/types';
import { eventDB, userDB } from '@/lib/db';

// GET /api/event/[id] - Get event by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = eventDB.getById(params.id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT /api/event/[id] - Update event
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventData = await request.json();
    const updatedEvent = eventDB.update(params.id, eventData);
    if (!updatedEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/event/[id] - Delete event
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = eventDB.delete(params.id);
    if (!success) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
} 