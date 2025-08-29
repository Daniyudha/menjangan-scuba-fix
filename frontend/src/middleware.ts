// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('jwt')?.value;
  const { pathname } = request.nextUrl;

  // --- LOGGING UNTUK DEBUGGING ---
  console.log('--- Middleware Intercept ---');
  console.log('Path:', pathname);
  console.log('Auth Token Found:', authToken ? `"${authToken.substring(0, 15)}..."` : 'No');
  // --------------------------------

  const isAdminPath = pathname.startsWith('/admin');
  const isAuthPath = pathname.startsWith('/login');

  if (isAdminPath && !authToken) {
    console.log('Action: Redirecting to /login');
    console.log('----------------------------\n');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPath && authToken) {
    console.log('Action: Redirecting to /admin/dashboard');
    console.log('----------------------------\n');
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  console.log('Action: Allowing request');
  console.log('----------------------------\n');
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}