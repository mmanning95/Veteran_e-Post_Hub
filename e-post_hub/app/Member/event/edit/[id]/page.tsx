"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  TimeInput,
} from "@nextui-org/react";
import { Time } from "@internationalized/date"; // For handling time
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditEventPage() {
  const router = useRouter();
  const { id } = useParams(); // Get the event ID from the route
  const [startTime, setStartTime] = useState<Time | null>(null); // Use Time for consistency
  const [endTime, setEndTime] = useState<Time | null>(null); // Use Time for consistency
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [eventTitle, setEventTitle] = useState("");
  const [flyerUrl, setFlyerUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/Event/edit?id=${id}`); // Use the GET endpoint
        if (response.ok) {
          const data = await response.json();

          // Populate form fields with event details
          setEventTitle(data.title || "");
          setFlyerUrl(data.flyer || "");
          setStartDate(
            data.startDate
              ? new Date(data.startDate).toISOString().split("T")[0]
              : ""
          );
          setEndDate(
            data.endDate
              ? new Date(data.endDate).toISOString().split("T")[0]
              : ""
          );
          setDescription(data.description || "");
          setWebsite(data.website || "");

          // Parse startTime and endTime into Time objects
          if (data.startTime) {
            const [hour, minute] = parseTime(data.startTime);
            setStartTime(new Time(hour, minute));
          }
          if (data.endTime) {
            const [hour, minute] = parseTime(data.endTime);
            setEndTime(new Time(hour, minute));
          }
        } else {
          console.error("Failed to fetch event details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    if (id) {
      fetchEventDetails(); // Fetch the event data when the component mounts
    }
  }, [id]);

  // Helper function to parse time strings (e.g., "2:00 PM") into hours and minutes
  const parseTime = (time: string): [number, number] => {
    const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return [0, 0];

    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const period = match[3].toUpperCase();

    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
    return [hour, minute];
  };

  // Helper function to format Time objects into "hh:mm AM/PM"
  const formatTime = (time: Time | null): string | null => {
    if (!time) return null;
    const hour = time.hour % 12 || 12;
    const minute = time.minute.toString().padStart(2, "0");
    const period = time.hour >= 12 ? "PM" : "AM";
    return `${hour}:${minute} ${period}`;
  };

  const handleSubmit = async () => {
    try {
      const formattedStartTime = formatTime(startTime);
      const formattedEndTime = formatTime(endTime);

      const response = await fetch(`/api/Event/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id, // Include id in the body
          title: eventTitle,
          flyer: flyerUrl,
          startDate,
          endDate,
          startTime: formattedStartTime, // Format startTime
          endTime: formattedEndTime, // Format endTime
          description,
          website,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Event updated successfully!" });
        setTimeout(() => {
          setMessage(null);
          router.push("/Member"); // Redirect to member page after success
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "Failed to update the event.",
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-2/5 mx-auto">
        <CardHeader className="flex flex-col items-center justify-center">
          <h3 className="text-3xl font-semibold text-black">Edit Event</h3>
        </CardHeader>
        <CardBody>
          {/* Message Display */}
          {message && (
            <div
              className={`mb-4 p-4 rounded ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}
          <form>
            <div className="space-y-4">
              <Input
                isRequired
                isClearable
                label="Event Title"
                variant="bordered"
                placeholder="Enter Event Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <Input
                label="Event Flyer (URL)"
                variant="bordered"
                placeholder="Enter Flyer URL"
                value={flyerUrl}
                onChange={(e) => setFlyerUrl(e.target.value)}
              />
              <div className="flex gap-4">
                <Input
                  type="date"
                  label="Start Date"
                  variant="bordered"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  label="End Date"
                  variant="bordered"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <TimeInput
                  label="Event Start Time"
                  value={startTime}
                  variant="bordered"
                  onChange={(newValue) => setStartTime(newValue)}
                />
                <TimeInput
                  label="Event End Time"
                  value={endTime}
                  variant="bordered"
                  onChange={(newValue) => setEndTime(newValue)}
                />
              </div>
              <Textarea
                label="Event Description"
                variant="bordered"
                placeholder="Enter Event Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                label="Event Website"
                variant="bordered"
                placeholder="Enter Website URL"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                <Button
                  fullWidth
                  className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-black border border-black"
                  onPress={handleSubmit}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
