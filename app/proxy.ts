import { NextRequest, NextResponse } from 'next/server';

const publicPaths = ['/login', '/register', '/'];
const guestAllowedPaths = ['/dashboard', '/jobs', '/gigs'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // Always allow public paths
  if (publicPaths.some((p) => pathname === p)) {
    // Redirect logged-in users away from login/register
    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Guest-allowed paths don't require auth (dashboard, jobs, gigs browsing)
  if (guestAllowedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Protected paths require auth
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
