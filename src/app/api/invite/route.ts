import { connectDB, User } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const API_SECRET = process.env.API_SECRET;

  if (!API_SECRET) {
    console.error("API_SECRET not set in environment");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const apiKey = req.headers.get('x-api-key');

  if (apiKey !== API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  const { username, password, companyTokenId } = await req.json();

  if (!username || !password || !companyTokenId) {
    return NextResponse.json(
      { error: 'username, password, and companyTokenId are required' },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedCompanyTokenId = await bcrypt.hash(companyTokenId, salt);

    await User.create({
      username,
      password: hashedPassword,
      companyTokenId: hashedCompanyTokenId,
    });

    return NextResponse.json({ message: 'User added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Invite Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
