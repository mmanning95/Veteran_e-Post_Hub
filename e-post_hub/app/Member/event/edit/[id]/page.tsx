"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  TimeInput,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Time } from "@internationalized/date";

export default function EditEventPage() {
  const router = useRouter();
  const { id } = useParams(); // Get the event ID from the route
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);
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

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/Event/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: eventTitle,
          flyer: flyerUrl,
          startDate,
          endDate,
          startTime: startTime?.toString(),
          endTime: endTime?.toString(),
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
        setMessage({ type: "error", text: "Failed to update the event." });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/Event/edit/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Event deleted successfully!" });
        setTimeout(() => {
          setMessage(null);
          router.push("/Member"); // Redirect to member page after success
        }, 3000);
      } else {
        setMessage({ type: "error", text: "Failed to delete the event." });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
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
                label="New Event Title"
                variant="bordered"
                placeholder="Enter New Event Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <Input
                label="New Event Flyer (URL)"
                variant="bordered"
                placeholder="Enter Flyer URL"
                value={flyerUrl}
                onChange={(e) => setFlyerUrl(e.target.value)}
              />
              <div className="flex gap-4">
                <Input
                  type="date"
                  label="New Start Date"
                  variant="bordered"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  label="New End Date"
                  variant="bordered"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <TimeInput
                  label="New Event Start Time"
                  value={startTime}
                  variant="bordered"
                  onChange={(newValue) => setStartTime(newValue)}
                />
                <TimeInput
                  label="New Event End Time"
                  value={endTime}
                  variant="bordered"
                  onChange={(newValue) => setEndTime(newValue)}
                />
              </div>
              <Textarea
                label="New Event Description"
                variant="bordered"
                placeholder="Enter New Event Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                label="New Event Website"
                variant="bordered"
                placeholder="For the use of external webpages"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                <Button
                  fullWidth
                  className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-black border border-black"
                  onClick={handleSubmit}
                >
                  Save Changes
                </Button>
                <Button
                  fullWidth
                  className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-black border border-black ml-4"
                  onClick={handleDelete}
                >
                  Delete Event
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
