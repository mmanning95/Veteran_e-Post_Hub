"use client";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import jwt from 'jsonwebtoken';

type Event = {
  id: string;
  title: string;
  description?: string;
  createdBy: {
    name: string;
    email: string;
  };
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  website?: string;
  flyer?: string;
};

export default function Memberpage() {
  const [isMember, setIsMember] = useState(false);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Check if the token is present in localStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Verify and decode the token to determine if the user is a member
        const decodedToken = jwt.decode(token) as { userId: string, role: string, name?: string };
        
        if (decodedToken && decodedToken.role === 'MEMBER') {
          setIsMember(true);
          setMemberName(decodedToken.name || 'Member');
          fetchApprovedEvents();
        } else {
          alert('Unauthorized access. Only member users can view this page.');
          window.location.href = './';
        }
      } catch (error) {
        console.error("Invalid token", error);
        alert('Invalid token. Please log in again.');
        window.location.href = './';
      }
    } else {
      alert('You need to log in to access the member page.');
      window.location.href = './';
    }
  }, []);

  // Fetch approved events from the API
  const fetchApprovedEvents = async () => {
    try {
      const response = await fetch('/api/Event/approved');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      } else {
        console.error('Failed to fetch approved events:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching approved events:', error);
    }
  };

  if (!isMember) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold">Welcome, {memberName || 'Member'}!</h3>
        <p className="text-lg mt-4">Check out the upcoming events that you can join!</p>
      </div>

      {/* Display the list of approved events */}
      <div className='mt-10'>
        <h4 className="text-2xl mb-4 text-center">Approved Events:</h4>
        {events.length === 0 ? (
          <p className='text-center'>No approved events at the moment.</p>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {events.map((event) => (
              <Card key={event.id} className="mb-4">
                <CardHeader>
                  <h5 className="text-xl font-bold">{event.title}</h5>
                </CardHeader>
                <CardBody>
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
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
