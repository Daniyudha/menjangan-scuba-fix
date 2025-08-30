// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('jwt')?.value;

  console.log(`--- Middleware Triggered for: ${pathname} ---`);
  console.log(`Auth Token Present: ${authToken ? 'Yes' : 'No'}`);

  // Path yang memerlukan otentikasi
  const protectedPaths = ['/admin'];
  // Path yang hanya untuk pengguna yang belum login
  const publicOnlyPaths = ['/login'];

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isPublicOnlyPath = publicOnlyPaths.some(path => pathname.startsWith(path));

  // KASUS 1: Mencoba mengakses halaman yang dilindungi (misal, /admin) TAPI tidak punya token
  if (isProtectedPath && !authToken) {
    console.log('Action: Not authenticated for a protected path. Redirecting to /login.');
    console.log('-------------------------------------\n');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // KASUS 2: Mencoba mengakses halaman login TAPI sudah punya token
  if (isPublicOnlyPath && authToken) {
    console.log('Action: Already authenticated. Redirecting to /admin/dashboard.');
    console.log('-------------------------------------\n');
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  console.log('Action: Allowed.');
  console.log('-------------------------------------\n');
  return NextResponse.next();
}

export const config = {
  // Jalankan middleware pada semua path KECUALI aset statis dan API
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}