"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';

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

export default function EventDetailsPage() {
  const { id } = useParams(); // Get event ID from the URL
  const [event, setEvent] = useState<Event | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch event details by ID
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/Event/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data.event);
        } else {
          setMessage('Failed to fetch event details.');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        setMessage('An error occurred while fetching event details.');
      }
    };

    fetchEventDetails();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  // Function to format website URL properly
  const formatWebsiteUrl = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  // Function to handle sharing the event
  const handleShareEvent = () => {
    const eventUrl = `${window.location.origin}/Event/${id}`;

    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: eventUrl,
      }).catch((error) => console.error('Error sharing', error));
    } else {
      // Fallback to copying the link to clipboard
      navigator.clipboard.writeText(eventUrl)
        .then(() => {
          setMessage('Event link copied to clipboard!');
          setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
        })
        .catch((error) => {
          console.error('Error copying to clipboard', error);
          setMessage('Failed to copy event link.');
          setTimeout(() => setMessage(null), 3000);
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-3/4">
        <CardHeader className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold text-orange-500">{event.title}</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {message && (
              <p role="alert" className="text-red-500 text-center">
                {message}
              </p>
            )}
            {event.flyer && (
              <div className="text-center">
                <img src={event.flyer} alt="Event Flyer" className="mx-auto w-full max-w-lg" />
              </div>
            )}
            {event.description && (
              <p className="text-gray-600">
                <strong>Description:</strong> {event.description}
              </p>
            )}
            {event.startDate && (
              <p className="text-gray-600">
                <strong>Start Date:</strong> {new Date(event.startDate).toLocaleDateString()}
              </p>
            )}
            {event.endDate && (
              <p className="text-gray-600">
                <strong>End Date:</strong> {new Date(event.endDate).toLocaleDateString()}
              </p>
            )}
            {event.startTime && (
              <p className="text-gray-600">
                <strong>Start Time:</strong> {event.startTime}
              </p>
            )}
            {event.endTime && (
              <p className="text-gray-600">
                <strong>End Time:</strong> {event.endTime}
              </p>
            )}
            {event.website && (
              <p className="text-gray-600">
                <strong>Website:</strong>{" "}
                <a
                  href={formatWebsiteUrl(event.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {event.website}
                </a>
              </p>
            )}
            <p className="text-gray-600">
              <strong>Created By:</strong> {event.createdBy.name} ({event.createdBy.email})
            </p>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Button
              className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
              onClick={() => (window.location.href = "/")}
            >
              Back to Homepage
            </Button>
            <Button
              className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
              onClick={handleShareEvent}
            >
              Share Event
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
