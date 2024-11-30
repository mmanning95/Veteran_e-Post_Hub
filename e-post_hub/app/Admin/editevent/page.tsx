"use client";

import React from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Textarea,
} from "@nextui-org/react";

export default function EditEventPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
      <Card
        className="w-3/5 p-6 border-2"
        style={{
          borderColor: "#f7960d",
        }}
      >
        <CardHeader className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-2xl font-semibold text-orange-500">Edit Event</h1>
        </CardHeader>
        <CardBody>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Event Title
              </label>
              <Input
                type="text"
                placeholder="Enter New Event Title"
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Enter Dates
              </label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-xs font-medium mb-1">
                    Start Date
                  </label>
                  <Input type="date" placeholder="Start Date" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-medium mb-1">
                    End Date
                  </label>
                  <Input type="date" placeholder="End Date" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Event Description
              </label>
              <Textarea
                placeholder="Enter New Event Description"
                fullWidth
                rows={6}
              />
            </div>

            <div className="flex justify-center gap-6 mt-6">
              <Button
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white"
                type="submit"
              >
                Save Changes
              </Button>
              <Button className="bg-gradient-to-r from-orange-400 to-orange-600 text-white">
                Delete Event
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
