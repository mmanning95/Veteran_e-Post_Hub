"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@nextui-org/react";
import Link from "next/link";
import EventCalendar from "./Components/Calendar/EventCalendar";

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
  interested: number;
};

export default function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch approved events
    async function fetchApprovedEvents() {
      try {
        const response = await fetch("/api/Event/approved"); // Adjust endpoint based on backend
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events);
          setFilteredEvents(data.events); // Initially, show all events
        } else {
          console.error(
            "Failed to fetch approved events:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching approved events:", error);
      }
    }

    fetchApprovedEvents();
  }, []);

  const handleInterest = async (eventId: string) => {
    const interestedEvents = JSON.parse(
      localStorage.getItem("interestedEvents") || "[]"
    ) as string[];

    // Check if the user has already expressed interest in this event
    if (interestedEvents.includes(eventId)) {
      setMessage("You have already expressed interest in this event.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Add the event ID to the list of interested events
    localStorage.setItem(
      "interestedEvents",
      JSON.stringify([...interestedEvents, eventId])
    );

    try {
      const response = await fetch(`/api/Event/interest/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId
              ? { ...event, interested: event.interested + 1 }
              : event
          )
        );
        setFilteredEvents((prevFilteredEvents) =>
          prevFilteredEvents.map((event) =>
            event.id === eventId
              ? { ...event, interested: event.interested + 1 }
              : event
          )
        );
        setMessage("Your interest has been recorded.");
      } else {
        setMessage("Failed to register interest.");
      }
    } catch (error) {
      console.error("Error registering interest:", error);
      setMessage("An error occurred. Please try again.");
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleDateClick = (date: string) => {
    // Filter events based on the selected date
    const eventsForDate = events.filter((event) => {
      const startDate = event.startDate
        ? new Date(event.startDate).toISOString().split("T")[0]
        : null;
      const endDate = event.endDate
        ? new Date(event.endDate).toISOString().split("T")[0]
        : null;
      return startDate && endDate && date >= startDate && date < endDate;
    });
    setFilteredEvents(eventsForDate);
  };

  const resetFilter = () => {
    setFilteredEvents(events); // Reset to show all events
  };

  return (
    <div className="flex">
      {/* Calendar Sidebar */}
      <div className="calendar-sidebar w-1/4 p-4">
        <EventCalendar events={events} onDateClick={handleDateClick} />
      </div>

      {/* Main Content */}
      <div className="content w-3/4 p-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            Welcome to the Veteran e-Post Hub
          </h1>
          <p className="text-lg mt-4">
            Find and participate in events specifically tailored for veterans
            and their families.
          </p>
        </div>

        {/* Button Container */}
        <div className="text-center mb-10 flex justify-center gap-4">
          <Button
            onClick={resetFilter}
            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
          >
            Show All Events
          </Button>
        </div>

        {message && (
          <div className="text-center mb-4 text-green-500">{message}</div>
        )}

        {/* Display the list of approved events */}
        <div className="mt-10">
          <h4 className="text-2xl mb-4 text-center">Events:</h4>
          {filteredEvents.length === 0 ? (
            <p className="text-center">No approved events at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="mb-4">
                  <div className="p-4">
                    <h5 className="text-xl font-bold">{event.title}</h5>
                    {event.description && (
                      <p className="text-gray-600">{event.description}</p>
                    )}
                    <p className="text-gray-600">
                      Created By: {event.createdBy.name} (
                      {event.createdBy.email})
                    </p>
                    {event.startDate && (
                      <p className="text-gray-600">
                        Start Date:{" "}
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    )}
                    {event.endDate && (
                      <p className="text-gray-600">
                        End Date: {new Date(event.endDate).toLocaleDateString()}
                      </p>
                    )}
                    {event.startTime && (
                      <p className="text-gray-600">
                        Start Time: {event.startTime}
                      </p>
                    )}
                    {event.endTime && (
                      <p className="text-gray-600">End Time: {event.endTime}</p>
                    )}
                    {event.website && (
                      <p className="text-gray-600">
                        Website:{" "}
                        <a
                          href={event.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {event.website}
                        </a>
                      </p>
                    )}
                    {event.flyer && (
                      <p className="text-gray-600">
                        Flyer:{" "}
                        <a
                          href={event.flyer}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Flyer
                        </a>
                      </p>
                    )}
                    <p className="text-gray-600">
                      Interested: {event.interested}
                    </p>
                    <Button
                      className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black mt-4"
                      onClick={() => handleInterest(event.id)}
                    >
                      I'm Interested
                    </Button>
                    <Link href={`/Event/${event.id}`} passHref>
                      <Button className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black mt-4">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
