

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, User } from '@/lib/db';

/**
 * POST /api/invite
 * Creates a new user via secured API access
 */
export async function POST(req: Request) {
  try {
    const API_SECRET = process.env.API_SECRET;

    if (!API_SECRET) {
      console.error('API_SECRET not set');
      return NextResponse.json(
        { success: false, error: 'Server misconfiguration' },
        { status: 500 }
      );
    }

    const apiKey = req.headers.get('x-api-key');
    if (apiKey !== API_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { username, password, companyTokenId } = await req.json();

    if (!username || !password || !companyTokenId) {
      return NextResponse.json(
        {
          success: false,
          error: 'username, password, and companyTokenId are required',
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedCompanyTokenId = await bcrypt.hash(companyTokenId, salt);

    await User.create({
      username,
      password: hashedPassword,
      companyTokenId: hashedCompanyTokenId,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User added successfully',
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('POST /api/invite error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
