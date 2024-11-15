'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import jwt from 'jsonwebtoken';

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

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check admin token
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt.decode(token) as { role?: string };
      if (decodedToken?.role === 'ADMIN') {
        setIsAdmin(true);
      } else {
        alert('Unauthorized access. Only admin users can view this page.');
        window.location.href = '/';
      }
    } else {
      alert('Unauthorized access. Only admin users can view this page.');
      window.location.href = '/';
    }

  // Fetch pending events
  async function fetchPendingEvents() {
    try {
      const response = await fetch('/api/Event/pending');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      } else {
        console.error('Failed to fetch pending events:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching pending events:', error);
    }
  }

    if (isAdmin) {
      fetchPendingEvents();
    }
  }, [isAdmin]);

  const handleApprove = async (eventId: string) => {
    try {
        console.log("Approving Event ID:", eventId); // Log the event ID

      const response = await fetch(`/api/Event/approve/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Event approved successfully.');
        setEvents(events.filter(event => event.id !== eventId));
      } else {
        const errorData = await response.json();
        console.error('Error approving event:', errorData); // Log detailed error
        alert(`Failed to approve event: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleDeny = async (eventId: string) => {
    try {
      const response = await fetch(`/api/Event/deny/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Event denied successfully.');
        setEvents(events.filter(event => event.id !== eventId));
      } else {
        const errorData = await response.json();
        alert(`Failed to deny event: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error denying event:', error);
    }
  };

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-3/5 mx-auto'>
      <Card>
        <CardHeader className='flex flex-col items-center justify-center'>
          <h3 className='text-3xl font-semibold'>Manage Pending Events</h3>
        </CardHeader>
        <CardBody>
          {events.length === 0 ? (
            <p className='text-center'>No pending events at the moment.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className='mb-4 p-4 border-b'>
                <h4 className='text-xl font-bold'>{event.title}</h4>
                <p className='text-gray-600'>{event.description}</p>
                <p className='text-gray-600'>Created By: {event.createdBy.name} ({event.createdBy.email})</p>
                {event.startDate && (
                  <p className='text-gray-600'>Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
                )}
                {event.endDate && (
                  <p className='text-gray-600'>End Date: {new Date(event.endDate).toLocaleDateString()}</p>
                )}
                {event.startTime && <p className='text-gray-600'>Start Time: {event.startTime}</p>}
                {event.endTime && <p className='text-gray-600'>End Time: {event.endTime}</p>}
                {event.website && (
                  <p className='text-gray-600'>
                    Website: <a href={event.website} target="_blank" rel="noopener noreferrer" className='text-blue-500 underline'>{event.website}</a>
                  </p>
                )}
                {event.flyer && (
                  <p className='text-gray-600'>
                    Flyer: <a href={event.flyer} target="_blank" rel="noopener noreferrer" className='text-blue-500 underline'>View Flyer</a>
                  </p>
                )}
                <div className='flex gap-2 mt-2'>
                  <Button
                    className='bg-green-500 text-white'
                    onClick={() => handleApprove(event.id)}
                    startContent={<AiOutlineCheck />}
                  >
                    Approve
                  </Button>
                  <Button
                    className='bg-red-500 text-white'
                    onClick={() => handleDeny(event.id)}
                    startContent={<AiOutlineClose />}
                  >
                    Deny
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}
