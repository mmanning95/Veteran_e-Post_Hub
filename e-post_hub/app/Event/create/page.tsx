'use client';
import React, { useEffect, useState } from 'react';
import EventForm from './EventForm';
import jwt from 'jsonwebtoken';

export default function CreateEventPage() {
  const [isUser, setIsUser] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: string, text: string } | null>(null);

  useEffect(() => {
    // Check if the token is present in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt.decode(token) as { userId: string, role: string, name?: string };
        if (decodedToken) {
          setIsUser(true);
        } else {
          setStatusMessage({ type: 'error', text: 'Unauthorized access. Please log in again.' });
          setTimeout(() => {
            window.location.href = './';
          }, 3000);
        }
      } catch (error) {
        console.error('Invalid token', error);
        setStatusMessage({ type: 'error', text: 'Invalid token. Please log in again.' });
        setTimeout(() => {
          window.location.href = './';
        }, 3000);
      }
    } else {
      setStatusMessage({ type: 'error', text: 'You need to log in to access the create page.' });
      setTimeout(() => {
        window.location.href = './';
      }, 3000);
    }

    // Retrieve status message from localStorage
    const storedMessage = localStorage.getItem('statusMessage');
    if (storedMessage) {
      setStatusMessage(JSON.parse(storedMessage));
      localStorage.removeItem('statusMessage'); // Clear message after displaying it
    }
  }, []);

  return (
    <div className='flex items-center justify-center' style={{ height: 'calc(100vh - 64px)' }}>
      {statusMessage && (
        <div className={`absolute top-10 px-4 py-2 rounded shadow-lg ${statusMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {statusMessage.text}
        </div>
      )}
      {isUser && <EventForm />}
    </div>
  );
}
