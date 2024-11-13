'use client'
import React, {useEffect, useState} from 'react';
import EventForm from './EventForm';
import jwt from 'jsonwebtoken'

export default function CreateEventPage() {
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    // Check if the token is present in localStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Verify and decode the token to determine if the user is an admin
        const decodedToken = jwt.decode(token) as { userId: string, role: string, name?: string };
        
        if (decodedToken ) {
          setIsUser(true); 
        } else {
          // If not an user, redirect to a different page (e.g., login page)
          alert('Unauthorized access. Only admin users can view this page.');
          window.location.href = './';
        }
      } catch (error) {
        console.error("Invalid token", error);
        alert('Invalid token. Please log in again.');
        window.location.href = './'; // Redirect to login page if token is invalid
      }
    } else {
      // If no token found, redirect to the login page
      alert('You need to log in to access the create page.');
      window.location.href = './';
    }
  }, []);

  return (
    <div className='flex items-center justify-center' style={{ height: 'calc(100vh - 64px)' }}>
      <EventForm />
    </div>
  );
}
