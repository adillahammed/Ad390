import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

const protectedRoutes = {
  CLIENT: ['/client-dashboard'],
  VENDOR: ['/vendor-dashboard'],
  ADMIN: ['/admin-dashboard'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // We only care about protected routes
  let requiredRole: 'CLIENT' | 'VENDOR' | 'ADMIN' | null = null;
  
  if (pathname.startsWith('/client-dashboard')) requiredRole = 'CLIENT';
  else if (pathname.startsWith('/vendor-dashboard')) requiredRole = 'VENDOR';
  else if (pathname.startsWith('/admin-dashboard')) requiredRole = 'ADMIN';

  // If it's not a protected route, let them proceed
  if (!requiredRole) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session')?.value;
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL(`/${requiredRole.toLowerCase()}-login`, request.url));
  }

  const payload = await decrypt(sessionCookie);

  if (!payload || payload.role !== requiredRole) {
    // Session invalid or role mismatch - redirect to corresponding login
    return NextResponse.redirect(new URL(`/${requiredRole.toLowerCase()}-login`, request.url));
  }

  // Session is valid, extend expiration by updating the cookie (optional, can be done via API)
  // For now, let them proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
