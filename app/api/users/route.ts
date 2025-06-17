import { NextResponse } from 'next/server';
import { User } from '@/types';
import { userDB } from '@/lib/db';

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = userDB.getAll();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const userData = await request.json();
    const newUser = userDB.create(userData);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 