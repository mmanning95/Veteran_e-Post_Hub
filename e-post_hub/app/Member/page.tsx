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
    id: string;
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

export default function Memberpage() {
  const [isMember, setIsMember] = useState(false);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Store the logged-in user's ID
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwt.decode(token) as {
          userId: string;
          role: string;
          name?: string;
        };

        if (decodedToken && decodedToken.role === "MEMBER") {
          setIsMember(true);
          setMemberName(decodedToken.name || "Member");
          setUserId(decodedToken.userId); // Save the logged-in user's ID
          fetchApprovedEvents();
        } else {
          setMessage("Unauthorized access.");
          setTimeout(() => {
            window.location.href = "/Unauthorized";
          }, 3000);
        }
      } catch (error) {
        console.error("Invalid token", error);
        setMessage("Invalid token. Redirecting...");
        setTimeout(() => {
          window.location.href = "/Unauthorized";
        }, 3000);
      }
    } else {
      setMessage("You need to log in to access the member page.");
      setTimeout(() => {
        window.location.href = "/Unauthorized";
      }, 3000);
    }
  }, []);

  // Fetch approved events
  const fetchApprovedEvents = async () => {
    try {
      const response = await fetch("/api/Event/approved");
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
        setFilteredEvents(data.events); // Initially, show all events
      } else {
        console.error("Failed to fetch approved events:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching approved events:", error);
    }
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

  const handleInterest = async (eventId: string) => {
    const interestedEvents = JSON.parse(
      localStorage.getItem("interestedEvents") || "[]"
    ) as string[];

    // Check if user has already expressed interest
    if (interestedEvents.includes(eventId)) {
      setMessage("You have already expressed interest in this event.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Add event to localStorage
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

  const handleDelete = async () => {
    if (!selectedEventId) return;

    try {
      const response = await fetch("/api/Event/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ eventId: selectedEventId }),
      });

      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== selectedEventId)
        );
        setFilteredEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== selectedEventId)
        );
        setMessage("Event deleted successfully.");
      } else {
        const errorData = await response.json();
        setMessage("Failed to delete the event: " + errorData.error);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setMessage("An error occurred while deleting the event.");
    } finally {
      setModalOpen(false);
      setSelectedEventId(null);
    }
  };

  return (
    <div className="flex">
      {/* Calendar Sidebar */}
      <div className="calendar-sidebar w-1/4 p-4">
        <EventCalendar events={events} onDateClick={handleDateClick} />
        {filteredEvents.length !== events.length && (
          <Button
            onClick={resetFilter}
            className="mt-4 bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black w-full"
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="content w-3/4 p-4">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold">
            Welcome, {memberName || "Member"}!
          </h3>
          <p className="text-lg mt-4">
            Check out the upcoming events that you can join!
          </p>
          {message && (
            <div className="text-center mt-4 text-green-500">{message}</div>
          )}
        </div>

        {/* Events List */}
        <div className="mt-10">
          <h4 className="text-2xl mb-4 text-center">Approved Events:</h4>
          {filteredEvents.length === 0 ? (
            <p className="text-center">No events found for the selected date</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="mb-4 w-full md:w - [320-px] lg:w-[380-px]"
                  style={{
                    minHeight: "400px",
                  }}
                >
                  {event.flyer ? (
                    <>
                      <CardHeader className="p-4 flex justify-between items-center">
                        <h5 className="text-xl font-bold">{event.title}</h5>
                        <p className="text-gray-600">
                          Interested: {event.interested}
                        </p>
                      </CardHeader>
                      <CardBody className="flex flex-col justify-between p-6">
                      <a href={event.flyer} target="_blank" rel="noopener noreferrer">
                      <img
                        src={event.flyer}
                        alt={`${event.title} Flyer`}
                        className="w-full h-full object-cover rounded-md"
                        style={{
                          maxHeight: "400px",
                        }}
                      />
                      </a>
                      <div className="flex flex-col gap-2 mt-4 justify-center items-center">
                      {userId === event.createdBy.id ? (
                        // If the Delete Event button is present
                        <>
                          {/* Top Row: I'm Interested and Delete Event */}
                          <div className="flex gap-2">
                            <Button
                              className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
                              onClick={() => handleInterest(event.id)}
                            >
                              I'm Interested
                            </Button>
                            <Button
                              className="delete-button bg-red-500 text-white"
                              onClick={() => {
                                setSelectedEventId(event.id);
                                setModalOpen(true);
                              }}
                            >
                              Delete Event
                            </Button>
                          </div>
                          {/* Bottom Row: View Details */}
                          <Button
                            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black w-full"
                            style={{ width: "220px" }} // Matches the combined width of top-row buttons
                            as={Link}
                            href={`/Event/${event.id}`}
                            passHref
                          >
                            View Details
                          </Button>
                        </>
                      ) : (
                        // If Delete Event button not present
                        <div className="flex gap-2">
                          {/* Side by Side: I'm Interested and View Details */}
                          <Button
                            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
                            onClick={() => handleInterest(event.id)}
                          >
                            I'm Interested
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
                            as={Link}
                            href={`/Event/${event.id}`}
                            passHref
                          >
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                      </CardBody>
                    </>
                  ) : (
                    <CardBody className="flex flex-col justify-between p-6">
                    <div>
                      <h5 className="text-xl font-bold mb-4">{event.title}</h5>
                      {event.description && (
                        <p className="text-gray-700 mb-4">{event.description}</p>
                      )}
                      <p className="text-gray-600">
                        <strong>Created By:</strong> {event.createdBy.name} (
                        {event.createdBy.email})
                      </p>
                      {event.startDate && (
                        <p className="text-gray-600">
                          <strong>Start Date:</strong>{" "}
                          {new Date(event.startDate).toLocaleDateString()}
                        </p>
                      )}
                      {event.endDate && (
                        <p className="text-gray-600">
                          <strong>End Date:</strong>{" "}
                          {new Date(event.endDate).toLocaleDateString()}
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
                            href={
                              event.website.startsWith("http://") || event.website.startsWith("https://")
                                ? event.website
                                : `https://${event.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {event.website}
                          </a>
                        </p>
                      )}

                      <p className="text-gray-600">
                        <strong>Interested:</strong> {event.interested}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 mt-4 justify-center items-center">
                      {userId === event.createdBy.id ? (
                        // If the Delete Event button is present
                        <>
                          {/* Top Row: I'm Interested and Delete Event */}
                          <div className="flex gap-2">
                            <Button
                              className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
                              onClick={() => handleInterest(event.id)}
                            >
                              I'm Interested
                            </Button>
                            <Button
                              className="delete-button bg-red-500 text-white"
                              onClick={() => {
                                setSelectedEventId(event.id);
                                setModalOpen(true);
                              }}
                            >
                              Delete Event
                            </Button>
                          </div>
                          {/* Bottom Row: View Details */}
                          <Button
                            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black w-full"
                            style={{ width: "220px" }} // Matches the combined width of top-row buttons
                            as={Link}
                            href={`/Event/${event.id}`}
                            passHref
                          >
                            View Details
                          </Button>
                        </>
                      ) : (
                        // If Delete Event button not present
                        <div className="flex gap-2">
                          {/* Side by Side: I'm Interested and View Details */}
                          <Button
                            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
                            onClick={() => handleInterest(event.id)}
                          >
                            I'm Interested
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
                            as={Link}
                            href={`/Event/${event.id}`}
                            passHref
                          >
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>                    </CardBody>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {modalOpen && (
        <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to delete this event?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Button
                className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black px-4 py-2 rounded-md"
                onClick={handleDelete}
              >
                Yes, Delete
              </Button>
              <Button
                className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black px-4 py-2 rounded-md"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
