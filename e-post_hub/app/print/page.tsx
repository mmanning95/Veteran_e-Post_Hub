"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

type Event = {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  type?: string;
  interested?: number;
  flyer?: string;
};

export default function PrintEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse filters from query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const filters = JSON.parse(searchParams.get("filters") || "{}");

    // Fetch all approved events
    const fetchApprovedEvents = async () => {
      try {
        let query = "/api/Event/approved"; // Adjust to actual API route
        const response = await fetch(query);
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        let filteredEvents = data.events;

        // 🔍 Apply Type Filtering (if any)
        if (filters.types?.length) {
          filteredEvents = filteredEvents.filter((event: Event) =>
            filters.types.includes(event.type!)
          );
        }

        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedEvents();
  }, []);

  // Automatically trigger print when events are loaded
  useEffect(() => {
    if (!loading && events.length > 0) {
      setTimeout(() => window.print(), 500);
    }
  }, [loading, events]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 print:bg-white">
      <h1 className="text-2xl font-bold text-center mb-4 print:text-xl">
        Event List
      </h1>

      {events.length === 0 ? (
        <p className="text-center">No events found for the selected filters.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-2 print:gap-2">
          {events.map((event) => (
            <Card
              key={event.id}
              className="p-3 border print:border print:shadow-none"
            >
              <CardHeader className="flex flex-col items-center text-center">
                <h2 className="text-lg font-semibold leading-tight">
                  {event.title}
                </h2>
                {event.flyer && (
                  <a
                    href={event.flyer}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={event.flyer}
                      alt={`${event.title} Flyer`}
                      className="w-full object-cover rounded-md my-2"
                      style={{ maxHeight: "120px" }} // Smaller image for print
                    />
                  </a>
                )}
              </CardHeader>
              <CardBody className="text-center text-sm print:text-xs">
                {event.startDate && (
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                )}
                {event.startTime && (
                  <p>
                    <strong>Time:</strong> {event.startTime} -{" "}
                    {event.endTime || "N/A"}
                  </p>
                )}
                {event.address && (
                  <p>
                    <strong>Location:</strong> {event.address}
                  </p>
                )}
                {event.type && (
                  <p>
                    <strong>Type:</strong> {event.type}
                  </p>
                )}
                {event.description && (
                  <p className="truncate">
                    <strong>Details:</strong> {event.description}
                  </p>
                )}
                <p>
                  <strong>Interested:</strong> {event.interested ?? 0}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
