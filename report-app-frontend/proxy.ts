import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const path = request.nextUrl.pathname;

  const isPublicPath = path.startsWith('/login') || path.startsWith('/register');
  const isRoot = path === '/';

  if (!token && !isPublicPath && !isRoot) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && (isPublicPath || isRoot)) {
    return NextResponse.redirect(new URL(role === 'MANAGER' ? '/dashboard' : '/reports', request.url));
  }

  if (token && role !== 'MANAGER' && (
    path.startsWith('/dashboard') ||
    path.startsWith('/projects') ||
    path.startsWith('/team')
  )) {
    return NextResponse.redirect(new URL('/reports', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.ico$).*)'],
};
