'use client';

import { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if the token is present in localStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode the JWT token to get user role
        const decodedToken = jwt.decode(token) as { role: string } | null;

        if (decodedToken) {
          // Redirect based on user role
          if (decodedToken.role === 'ADMIN') {
            router.push('/Admin');
          } else if (decodedToken.role === 'MEMBER') {
            router.push('/Member');
          }
        }
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, [router]);

  return (
    <div>
      <div>
        <h1>Welcome to the Veteran e-Post Hub</h1>
      </div>

    </div>
  );
}
