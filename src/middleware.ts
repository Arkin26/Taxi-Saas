// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Adjust your cookie key as needed!
const AUTH_COOKIE = 'authToken';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const isAuthed = request.cookies.get(AUTH_COOKIE)?.value;
    if (!isAuthed) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}
