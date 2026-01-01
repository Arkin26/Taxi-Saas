// /pages/api/complete-invite.ts
import bcrypt from 'bcryptjs';
import { connectDB, Invite, User } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, username, password } = req.body;

  if (!token || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await connectDB();

    const invite = await Invite.findOne({ token, used: false });

    if (!invite) {
      return res.status(400).json({ error: 'Invalid or already used invite token' });
    }

    const existingUser = await User.findOne({ email: invite.email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email: invite.email,
      password: hashedPassword,
    });

    invite.used = true;
    await invite.save();

    return res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Complete Invite Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
