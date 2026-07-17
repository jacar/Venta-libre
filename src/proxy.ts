import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // Check if the user is logged in and their email matches the admin email
    const isAdmin = token?.email === process.env.ADMIN_EMAIL;
    
    if (!token || !isAdmin) {
      // If not an admin, redirect to login page or home page
      // Here we redirect to /login with a callback URL
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
