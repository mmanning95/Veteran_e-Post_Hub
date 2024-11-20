// Admin page that will be displayed. Does not allow unauthorized users to visit page

"use client";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

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
          alert("Unauthorized access. Only admin users can view this page.");
          window.location.href = "./";
        }
      } catch (error) {
        console.error("Invalid token", error);
        alert("Invalid token. Please log in again.");
        window.location.href = "./"; // Redirect to login page if token is invalid
      }
    } else {
      alert("You need to log in to access the admin page.");
      window.location.href = "./";
    }

    // Fetch approved events (or all events depending on requirements)
    async function fetchEvents() {
      try {
        const response = await fetch("/api/Event/approved"); // Update the endpoint based on your backend
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events);
        } else {
          console.error("Failed to fetch events:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
  }, []);

  if (!isAdmin) {
    // Show a loading message while we verify if the user is an admin
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold">Welcome, {adminName || "Admin"}!</h3>
        <p className="text-lg mt-4">
          Manage the events, edit them, or take other administrative actions.
        </p>
      </div>

      {/* Button container */}
      <div className="text-center mb-10 flex justify-center gap-4">
        <Button
          as={Link}
          href="/Admin/creatorcode"
          className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-white"
        >
          Creator Code
        </Button>
        <Button
          as={Link}
          href="/Admin/editevent"
          className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-white"
        >
          Edit Event
        </Button>
      </div>

      {/* Display the list of approved events */}
      <div className="mt-10">
        <h4 className="text-2xl mb-4 text-center">Approved Events:</h4>
        {events.length === 0 ? (
          <p className="text-center">No approved events at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
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
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
