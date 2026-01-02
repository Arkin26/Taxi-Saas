// import { connectDB, Invite } from '@/lib/db';
// import { NextResponse } from 'next/server';

// export async function GET(req: Request) {
//   await connectDB();

//   const { searchParams } = new URL(req.url);
//   const token = searchParams.get('token');

//   if (!token || typeof token !== 'string' || !token.trim()) {
//     return NextResponse.json({ error: 'Token is required and must be a string.' }, { status: 400 });
//   }

//   try {
//     const invite = await Invite.findOne({ token, used: false });

//     if (!invite) {
//       return NextResponse.json({ error: 'Invalid or already used invite token.' }, { status: 400 });
//     }

//     if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
//       return NextResponse.json({ error: 'Invite link has expired.' }, { status: 410 });
//     }

//     return NextResponse.json({
//       email: invite.email,
//       companyId: invite.companyId,
//     });
//   } catch (err) {
//     console.error('Token verification error:', err);
//     return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { connectDB, Invite } from '@/lib/db';

/* ===================== TYPES ===================== */

interface InviteLean {
  email: string;
  companyId: string;
  expiresAt?: Date;
  used?: boolean;
}

/* ===================== GET ===================== */
/**
 * GET /api/verify-token?token=xxxx
 * Verifies invite token validity
 */
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token || !token.trim()) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const invite = (await Invite.findOne({
      token,
      used: false,
    }).lean()) as unknown as InviteLean | null;

    if (!invite) {
      return NextResponse.json(
        { success: false, error: 'Invalid or already used invite token' },
        { status: 400 }
      );
    }

    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Invite link has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        email: invite.email,
        companyId: invite.companyId,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('GET /api/verify-token error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
