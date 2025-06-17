import { NextResponse } from 'next/server';
import { userDB } from '@/lib/db';

// POST /api/auth/register - Create a new user
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