'use client';

import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@nextui-org/react';
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  description?: string;
  createdBy: {
    name: string;
    email: string;
  };
  status: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  website?: string;
  flyer?: string;
};

export default function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);

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

    // Fetch approved events
    async function fetchApprovedEvents() {
      try {
        const response = await fetch('/api/Event/approved'); // Adjust endpoint based on your backend
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events);
        } else {
          console.error('Failed to fetch approved events:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching approved events:', error);
      }
    }

    fetchApprovedEvents();
  }, [router]);

  return (
    <div>
      <div className='text-center mb-10'>
        <h1 className='text-4xl font-bold'>Welcome to the Veteran e-Post Hub</h1>
        <p className='text-lg mt-4'>Find and participate in events specifically tailored for veterans and their families.</p>
      </div>

      {/* Display the list of approved events */}
      <div className='mt-10'>
        <h4 className="text-2xl mb-4 text-center">Events:</h4>
        {events.length === 0 ? (
          <p className='text-center'>No approved events at the moment.</p>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {events.map((event) => (
              <Card key={event.id} className="mb-4">
                <div className="p-4">
                  <h5 className="text-xl font-bold">{event.title}</h5>
                  {event.description && <p className="text-gray-600">{event.description}</p>}
                  <p className="text-gray-600">Created By: {event.createdBy.name} ({event.createdBy.email})</p>
                  {event.startDate && (
                    <p className="text-gray-600">Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
                  )}
                  {event.endDate && (
                    <p className="text-gray-600">End Date: {new Date(event.endDate).toLocaleDateString()}</p>
                  )}
                  {event.startTime && <p className="text-gray-600">Start Time: {event.startTime}</p>}
                  {event.endTime && <p className="text-gray-600">End Time: {event.endTime}</p>}
                  {event.website && (
                    <p className="text-gray-600">
                      Website: <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{event.website}</a>
                    </p>
                  )}
                  {event.flyer && (
                    <p className="text-gray-600">
                      Flyer: <a href={event.flyer} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Flyer</a>
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
