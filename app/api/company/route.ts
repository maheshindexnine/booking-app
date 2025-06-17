import { NextResponse } from 'next/server';
import { companyDB } from '@/lib/db';

// GET /api/event - Get all companies
export async function GET(request: Request) {
  try {
    const companies = companyDB.getAll();
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST /api/event - Create a new company
export async function POST(request: Request) {
  try {
    const companyData = await request.json();
    const newCompany = companyDB.create(companyData);
    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
} 