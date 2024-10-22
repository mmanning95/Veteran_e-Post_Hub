//used to confirm user is an admin

// e-post_hub/app/admin/_middleware.ts

import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value; // Get the token from cookies

  if (token) {
    try {
      // Verify the token with the secret
      const secret = process.env.JWT_SECRET as string;
      jwt.verify(token, secret);

      // If verification is successful, allow request
      return NextResponse.next();
    } catch (error) {
      console.error("Invalid or expired token", error);
    }
  }
  else {
    // If no token found, redirect to the login page
    console.error("No token found");
    return NextResponse.redirect(new URL('/Login', req.url));
  }
}
