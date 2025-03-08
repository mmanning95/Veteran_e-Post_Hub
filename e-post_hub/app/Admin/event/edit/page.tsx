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
import { Time } from "@internationalized/date";

export default function EditEventPage() {
  // States to store time values for start and end time
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);

  // State for displaying success or error messages
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async () => {
    // Logic for editing the event
    setMessage({ type: "success", text: "Event updated successfully!" });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async () => {
    // Logic for deleting the event
    setMessage({ type: "error", text: "Event deleted successfully!" });
    setTimeout(() => setMessage(null), 3000);
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
              />
              <Input
                label="New Event Flyer (URL)"
                variant="bordered"
                placeholder="Enter Flyer URL"
              />
              <div className="flex gap-4">
                <Input type="date" label="New Start Date" variant="bordered" />
                <Input type="date" label="New End Date" variant="bordered" />
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
              />
              <Input
                label="New Event Website"
                variant="bordered"
                placeholder="For the use of external webpages"
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
