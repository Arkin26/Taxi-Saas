import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { username, password, token } = await req.json()

    if (!username || !password || !token) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 })
    }

    await connectDB()
    const user = await User.findOne({ username })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    const isTokenValid = await bcrypt.compare(token, user.companyTokenId)

    if (!isPasswordValid || !isTokenValid) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    // On successful login, set an HttpOnly cookie to authenticate subsequent requests securely
    const response = NextResponse.json({ success: true, token })

    // Adjust cookie options as needed for your environment
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })

    return response

  } catch (err) {
    console.error('Login Error:', err)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
