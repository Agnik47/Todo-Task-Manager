import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// JWT Verify Function
const verifyJWT = async (token) => {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return payload;
  } catch (error) {
    return null;
  }
};

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;

  const isAuth = token && await verifyJWT(token);

  // If user is logged in, don't allow access to login or register page
  if (isAuth && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not logged in, block protected routes
  if (!isAuth && (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/contact' || request.nextUrl.pathname === '/about')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/contact', '/about'],
};
