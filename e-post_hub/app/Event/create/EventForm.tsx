"use client";

import {
  createEventSchema,
  CreateEventSchema,
} from "@/lib/schemas/createEventSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  TimeInput,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Time } from "@internationalized/date";
import React, { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import Link from "next/link";
import { SingleImageDropzone } from "@/app/Components/Dropzone/single-image-dropzone";
import { LoadScript } from "@react-google-maps/api";
import { usePlacesWidget } from "react-google-autocomplete";

export default function EventForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateEventSchema>({
    //resolver: zodResolver(createEventSchema),
    mode: "onTouched",
  });

  // States to store the time values for start and end time
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);
  const [file, setFile] = useState<File>();
  const [eventType, setEventType] = useState<string | null>(null);
  const [urls, setUrls] = useState<{
    url: string;
    thumbnailUrl: string | null;
  }>();
  const { edgestore } = useEdgeStore();

  // State for displaying success or error messages
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const onSubmit = async (data: CreateEventSchema) => {
    try {
      // If there is an image file upload it to get its URL
      let flyerUrl: string | null = null;
      if (file) {
        const uploadResponse = await edgestore.myPublicImages.upload({ file });
        flyerUrl = uploadResponse.url; // Store uploaded image URL
      }

      // Format startTime and endTime to include AM/PM information
      const formattedStartTime = startTime
        ? `${startTime.hour % 12 || 12}:${startTime.minute
            .toString()
            .padStart(2, "0")} ${startTime.hour >= 12 ? "PM" : "AM"}`
        : null;

      const formattedEndTime = endTime
        ? `${endTime.hour % 12 || 12}:${endTime.minute
            .toString()
            .padStart(2, "0")} ${endTime.hour >= 12 ? "PM" : "AM"}`
        : null;

      const fullData = {
        ...data,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        flyer: flyerUrl,
        type: eventType, // Add selected event type
        address: data.address,
      };

      const response = await fetch("/api/Event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(fullData),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Event successfully created!" });
        //redirect after some time
        setTimeout(() => {
          window.location.href = "/Event/create";
        }, 3000);
      } else {
        const errorResponse = await response.json();
        setMessage({
          type: "error",
          text: `Event creation failed: ${errorResponse.message}`,
        });
      }
    } catch (error) {
      console.error("An error occurred while creating the event:", error);
      setMessage({
        type: "error",
        text: "An error occurred while creating the event.",
      });
    }
  };

  // Address State
  const [address, setAddress] = useState("");

  const { ref } = usePlacesWidget<HTMLInputElement>({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    onPlaceSelected: (place) => {
      const selectedAddress = place.formatted_address || "";
      setAddress(selectedAddress);
      setValue("address", selectedAddress); // ✅ Ensure React Hook Form updates
    },
    options: {
      types: ["geocode"],
      componentRestrictions: { country: "us" },
    },
  });

  return (
    <Card className="w-2/5 mx-auto max-h-[80vh] overflow-y-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <h3 className="text-3xl font-semibold">Create New Event</h3>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              isRequired
              isClearable
              label="Event Title"
              variant="bordered"
              {...register("title")}
              errorMessage={errors.title?.message}
            />

            <div className="flex gap-4">
              <Input
                type="date"
                label="Start Date"
                variant="bordered"
                {...register("startDate")}
                errorMessage={errors.startDate?.message}
              />
              <Input
                type="date"
                label="End Date"
                variant="bordered"
                {...register("endDate")}
                errorMessage={errors.endDate?.message}
              />
            </div>

            <div className="flex gap-4">
              <TimeInput
                label="Event Start Time"
                value={startTime}
                variant="bordered"
                onChange={(newValue) => setStartTime(newValue)}
                errorMessage={errors.startTime?.message}
              />
              <TimeInput
                label="Event End Time"
                value={endTime}
                variant="bordered"
                onChange={(newValue) => setEndTime(newValue)}
                errorMessage={errors.endTime?.message}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Description */}
              <div className="flex-1">
                <Textarea
                  minRows={8}
                  label="Event Description"
                  variant="bordered"
                  {...register("description")}
                  errorMessage={errors.description?.message}
                  style={{ height: "200px", resize: "none" }}
                />
              </div>
              {/* Image Dropzone */}
              <div>
                <SingleImageDropzone
                  width={200}
                  height={200}
                  value={file}
                  dropzoneOptions={{
                    maxSize: 1024 * 1024 * 2, //2mb max size
                  }}
                  onChange={(newfile) => {
                    setFile(newfile);
                  }}
                />
                {/* Uncomment to show URL and Thumbnail links */}
                {/* {urls?.url && <Link href={urls.url} target="_blank">URL</Link>}
                {urls?.thumbnailUrl && (
                  <Link href={urls.thumbnailUrl} target="_blank">THUMBNAIL</Link>
                )} */}
              </div>
            </div>

            {/* Event Type Dropdown */}
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="w-full border-2 border-gray-300 border-opacity-65 rounded-lg bg-white px-4 py-2 shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  style={{
                    justifyContent: "flex-start", // Force left alignment
                    textAlign: "left", // Ensure text aligns left
                  }}
                >
                  {eventType || "Select Event Type"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Event Type Selection"
                onAction={(key) => setEventType(key as string)}
                className="w-full border border-gray-300 border-opacity-75 rounded-lg shadow-sm"
              >
                <DropdownItem key="Workshop">Workshop</DropdownItem>
                <DropdownItem key="Seminar">Seminar</DropdownItem>
                <DropdownItem key="Meeting">Meeting</DropdownItem>
                <DropdownItem key="Fundraiser">Fundraiser</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* Autocomplete Address Input */}
            <Input
              label="Event Address"
              ref={ref as unknown as React.RefObject<HTMLInputElement>} // ✅ Fix TypeScript issue
              variant="bordered"
              placeholder="Enter event location"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              errorMessage={errors.address?.message}
            />

            <Input
              label="Event Website"
              variant="bordered"
              {...register("website")}
              errorMessage={errors.website?.message}
              placeholder="For the use of external webpages"
            />

            <Button
              isDisabled={!isValid}
              fullWidth
              type="submit"
              className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black"
            >
              Submit Event
            </Button>
            <div className="text-[#757575]" style={{ fontSize: "12px" }}>
              Note: Either (title and description) or (title and flyer) is
              required for flyer submissions. Additional information is
              encouraged.
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
