import { connectDB, Invite } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token || typeof token !== 'string' || !token.trim()) {
    return NextResponse.json({ error: 'Token is required and must be a string.' }, { status: 400 });
  }

  try {
    const invite = await Invite.findOne({ token, used: false });

    if (!invite) {
      return NextResponse.json({ error: 'Invalid or already used invite token.' }, { status: 400 });
    }

    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Invite link has expired.' }, { status: 410 });
    }

    return NextResponse.json({
      email: invite.email,
      companyId: invite.companyId,
    });
  } catch (err) {
    console.error('Token verification error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
