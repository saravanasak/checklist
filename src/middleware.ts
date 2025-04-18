import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  // Create a Supabase client for auth checks
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get the user's session
  const { data: { session } } = await supabase.auth.getSession();

  // Check if the request is for an admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // If it's an admin route and the user is not authenticated, redirect to login
  if (isAdminRoute && !session) {
    // For demo purposes, we're not enforcing authentication yet
    // Uncomment the following line to enforce authentication
    // return NextResponse.redirect(new URL('/login', request.url));
    
    // For now, allow access to admin routes without authentication
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Specify which routes the middleware should run on
  matcher: ['/admin/:path*'],
};
