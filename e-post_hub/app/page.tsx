"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import EventCalendar from "./Components/Calendar/EventCalendar";
import jwt from "jsonwebtoken";
import BottomBar from "./Components/BottomBar/BottomBar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

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
  type?: string;
  interested: number;
  latitude: number;
  longitude: number;
  distance: number;
};

export default function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedProximity, setSelectedProximity] = useState<number | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleTypeFilter = (keys: Set<string>) => {
    setSelectedTypes(keys);
    const selectedArray = Array.from(keys);

    if (selectedArray.length === 0) {
      setFilteredEvents(events); // Show all events if no filter is selected
    } else {
      setFilteredEvents(
        events.filter((event) => selectedArray.includes(event.type || ""))
      );
    }
  };

  const getUserLocation = () => {
    if (!("geolocation" in navigator)) {
      setMessage("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserLocation((prevLocation) =>
          prevLocation &&
          prevLocation.lat === newLocation.lat &&
          prevLocation.lng === newLocation.lng
            ? prevLocation
            : newLocation
        );
      },
      () =>
        setMessage(
          "Location access denied. Please enable location permissions."
        ),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const fetchEventDistances = async (events: Event[]) => {
    if (!userLocation) return events;

    const validEvents = events.filter(
      (event) => event.latitude !== null && event.longitude !== null
    );

    if (validEvents.length === 0) return events;

    const destinations = validEvents
      .map((event) => `${event.latitude},${event.longitude}`)
      .join("|");

    if (!destinations) return events;

    const url = `/api/proximity?origins=${userLocation.lat},${userLocation.lng}&destinations=${destinations}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== "OK" || !data.rows || data.rows.length === 0)
        return events;

      const distances = data.rows[0].elements;

      return validEvents.map((event, index) =>
        distances[index]?.status === "OK"
          ? {
              ...event,
              distance: distances[index].distance.value / 1609.34,
            }
          : { ...event, distance: NaN }
      );
    } catch {
      return events;
    }
  };

  const handleProximityFilter = async (distance: number) => {
    if (!userLocation) return;

    setSelectedProximity(distance);

    const updatedEvents = await fetchEventDistances(events);

    setFilteredEvents(
      updatedEvents.filter(
        (event) => event.distance !== undefined && event.distance <= distance
      )
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwt.decode(token) as { role: string };

        if (decodedToken) {
          if (decodedToken.role === "ADMIN") {
            router.push("/Admin");
            return;
          } else if (decodedToken.role === "MEMBER") {
            router.push("/Member");
            return;
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        return;
      }
    } else {
      return;
    }
  }, [router]);

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

  useEffect(() => {
    getUserLocation(); // ✅ Calls function when component loads
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
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex">
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
            <h1 className="text-4xl font-bold">
              Welcome to the Veteran e-Post Hub
            </h1>
            <p className="text-lg mt-4">
              Find and participate in events specifically tailored for veterans
              and their families.
            </p>
          </div>

          {/* Display the list of approved events */}
          <div className="mt-10">
            <h4 className="text-2xl mb-4 text-center">Events:</h4>

            {/* Navbar for filter buttons */}
            <div className="max-w-[1140px] mx-auto bg-white p-4 rounded-lg shadow border border-gray-200 mb-6 flex gap-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button className="border border-gray-300 bg-white text-black">
                    Event Type
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Filter by Event Type"
                  selectionMode="multiple"
                  selectedKeys={selectedTypes}
                  onSelectionChange={(keys) =>
                    handleTypeFilter(keys as Set<string>)
                  }
                >
                  <DropdownItem key="Workshop">Workshop</DropdownItem>
                  <DropdownItem key="Seminar">Seminar</DropdownItem>
                  <DropdownItem key="Meeting">Meeting</DropdownItem>
                  <DropdownItem key="Fundraiser">Fundraiser</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              {/* Proximity Filter */}
              <Dropdown>
                <DropdownTrigger>
                  <Button className="border border-gray-300 bg-white text-black">
                    Distance
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Filter by Distance"
                  selectionMode="single"
                  selectedKeys={
                    selectedProximity ? [String(selectedProximity)] : []
                  }
                  onSelectionChange={(keys) => {
                    const selectedValue = Number(Array.from(keys)[0] as string);
                    handleProximityFilter(selectedValue);
                  }}
                >
                  <DropdownItem key="5">Within 5 miles</DropdownItem>
                  <DropdownItem key="10">Within 10 miles</DropdownItem>
                  <DropdownItem key="20">Within 20 miles</DropdownItem>
                  <DropdownItem key="50">Within 50 miles</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            {filteredEvents.length === 0 ? (
              <p className="text-center">
                No events found for the selected date
              </p>
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
                      // Display title, image, and buttons if the flyer exists
                      <>
                        <CardHeader className="p-4 flex justify-between items-center">
                          <h5 className="text-xl font-bold">{event.title}</h5>
                          <p className="text-gray-600">
                            <strong>Interested:</strong> {event.interested}
                          </p>
                        </CardHeader>
                        <CardBody className="flex flex-col justify-between p-6">
                          <a
                            href={event.flyer}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={event.flyer}
                              alt={`${event.title} Flyer`}
                              className="w-full h-full object-cover rounded-md"
                              style={{
                                maxHeight: "400px",
                              }}
                            />
                          </a>
                          <div className="flex gap-2 mt-4 justify-center">
                            <Button
                              className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
                              onClick={() => handleInterest(event.id)}
                            >
                              I'm Interested
                            </Button>
                            <Link href={`/Event/${event.id}`} passHref>
                              <Button className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </CardBody>
                      </>
                    ) : (
                      // Display all event information if no flyer exists
                      <CardBody className="flex flex-col justify-between p-6">
                        <div>
                          <h5 className="text-xl font-bold mb-4">
                            {event.title}
                          </h5>
                          {event.description && (
                            <p className="text-gray-700 mb-4">
                              {event.description}
                            </p>
                          )}
                          <p className="text-gray-600">
                            <strong>Created By:</strong> {event.createdBy.name}{" "}
                            ({event.createdBy.email})
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
                                  event.website.startsWith("http://") ||
                                  event.website.startsWith("https://")
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
                        <div className="flex gap-2 mt-4 justify-center">
                          <Button
                            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
                            onClick={() => handleInterest(event.id)}
                          >
                            I'm Interested
                          </Button>
                          <Link href={`/Event/${event.id}`} passHref>
                            <Button className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardBody>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
