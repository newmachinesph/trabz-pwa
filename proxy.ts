import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/register', '/about', '/learning'];
const GUEST_BROWSABLE_PATHS = ['/dashboard', '/jobs', '/gigs'];
const AUTH_REQUIRED_PATHS = ['/profile', '/wallet'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal Next.js routes, API routes, static files, and PWA assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/AppImages') ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;

  let isAuthenticated = Boolean(accessToken);
  if (isAuthenticated && accessToken) {
    try {
      const parts = accessToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          isAuthenticated = false;
        }
      }
    } catch {
      // If decoding fails, treat as unauthenticated
      isAuthenticated = false;
    }
  }

  // Redirect authenticated users away from login/register to dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow public paths without any auth
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow guest-browsable paths without auth
  if (GUEST_BROWSABLE_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Require auth for protected paths
  if (AUTH_REQUIRED_PATHS.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
