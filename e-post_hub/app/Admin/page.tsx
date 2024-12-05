"use client";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import EventCalendar from "../Components/Calendar/EventCalendar";

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

export default function Adminpage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if the token is present in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Verify and decode the token to determine if the user is an admin
        const decodedToken = jwt.decode(token) as {
          userId: string;
          role: string;
          name?: string;
        };
        if (decodedToken && decodedToken.role === "ADMIN") {
          setIsAdmin(true); // User is an admin
          setAdminName(decodedToken.name || "Admin"); // Store the admin's name for display
          fetchEvents();
        } else {
          setMessage("Unauthorized access. Only admin users can view this page.");
          setTimeout(() => {
            window.location.href = "./";
          }, 3000);
        }
      } catch (error) {
        console.error("Invalid token", error);
        setMessage("Invalid token. Please log in again.");
        setTimeout(() => {
          window.location.href = "./"; // Redirect to login page if token is invalid
        }, 3000);
      }
    } else {
      setMessage("You need to log in to access the admin page.");
      setTimeout(() => {
        window.location.href = "./";
      }, 3000);
    }

    // Fetch approved events (or all events depending on requirements)
    async function fetchEvents() {
      try {
        const response = await fetch("/api/Event/approved"); // Update the endpoint based on your backend
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events);
          setFilteredEvents(data.events); // Initially, show all events
        } else {
          setMessage("Failed to fetch events.");
          console.error("Failed to fetch events:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setMessage("An error occurred while fetching events.");
      }
    }
  }, []);

  const handleDateClick = (date: string) => {
    // Filter events based on the selected date
    const eventsForDate = events.filter((event) => {
      const startDate = event.startDate ? new Date(event.startDate).toISOString().split("T")[0] : null;
      const endDate = event.endDate ? new Date(event.endDate).toISOString().split("T")[0] : null;
      return startDate && endDate && date >= startDate && date <= endDate;
    });
    setFilteredEvents(eventsForDate);
  };

  const resetFilter = () => {
    setFilteredEvents(events); // Reset to show all events
  };

  if (!isAdmin) {
    // Show a loading message while we verify if the user is an admin
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Calendar Sidebar */}
      <div className="calendar-sidebar w-1/4 p-4">
        <EventCalendar events={events} onDateClick={handleDateClick} />
      </div>

      {/* Main Content */}
      <div className="content w-3/4 p-4">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold">Welcome, {adminName || "Admin"}!</h3>
          <p className="text-lg mt-4">
            Manage the events, edit them, or take other administrative actions.
          </p>
          {message && (
            <div className="text-center mt-4 p-2 bg-blue-100 text-blue-800 border border-blue-300 rounded">
              {message}
            </div>
          )}
        </div>

        {/* Button Container */}
        <div className="text-center mb-10 flex justify-center gap-4">
          <Button
            as={Link}
            href="/Admin/creatorcode"
            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
          >
            Creator Code
          </Button>
          <Button
            as={Link}
            href="/Admin/editevent"
            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
          >
            Edit Event
          </Button>
          <Button
            onClick={resetFilter}
            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
          >
            Show All Events
          </Button>
        </div>

        {/* Display Events for Selected Date */}
        <div className="mt-10">
          <h4 className="text-2xl mb-4 text-center">Events:</h4>
          {filteredEvents.length === 0 ? (
            <p className="text-center">No events available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="mb-4">
                  <CardHeader>
                    <h5 className="text-xl font-bold">{event.title}</h5>
                  </CardHeader>
                  <CardBody>
                    {event.description && (
                      <p className="text-gray-600">{event.description}</p>
                    )}
                    <p className="text-gray-600">
                      Created By: {event.createdBy.name} ({event.createdBy.email})
                    </p>
                    {event.startDate && (
                      <p className="text-gray-600">Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
                    )}
                    {event.endDate && (
                      <p className="text-gray-600">End Date: {new Date(event.endDate).toLocaleDateString()}</p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="delete-button bg-red-500 text-white"
                        onClick={() => {
                          // Assuming you have a delete function for events
                        }}
                      >
                        Delete Event
                      </Button>
                      <Link href={`/Event/${event.id}`} passHref>
                        <Button className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
