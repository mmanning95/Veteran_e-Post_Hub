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
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { Time } from "@internationalized/date";
import React, { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import Link from "next/link";
import { SingleImageDropzone } from "@/app/Components/Dropzone/single-image-dropzone";
import { LoadScript } from "@react-google-maps/api";
import { usePlacesWidget } from "react-google-autocomplete";

const predefinedEventType = ["Workshop", "Seminar", "Meeting", "Fundraiser"];

interface CreateEventForm {
  title: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  type: string;
  website?: string;
  address?: string;
}

export default function EventForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateEventForm>({
    mode: "onChange",
  });

  // States
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [eventType, setEventType] = useState(predefinedEventType);
  const [selectedType, setSelectedType] = useState("");
  const [urls, setUrls] = useState<{
    url: string;
    thumbnailUrl: string | null;
  }>();
  const { edgestore } = useEdgeStore();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Watch form values
  const watchTitle = watch("title");
  const watchStartDate = watch("startDate");
  const watchEndDate = watch("endDate");
  const watchDescription = watch("description");
  const watchType = watch("type");

  // Check form validity: Title, Start/End Date, Type, and EITHER Description OR Flyer
  const isFormValid =
    watchTitle &&
    watchStartDate &&
    watchEndDate &&
    watchType &&
    (watchDescription || file);

  const handleTypeChange = (type: string) => {
    if (!type.trim()) return; // Prevent empty inputs
    setSelectedType(type);
    setValue("type", type, { shouldValidate: true });

    if (!eventType.includes(type.trim())) {
      setEventType([...eventType, type.trim()]); // Trim to avoid whitespace issues
    }
  };

  const isImageFile = React.useMemo(() => {
    if (file && file.type.includes("image")) return true;
    return false;
  }, [file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    setFile(newFile || null);

    // If it’s an image, show preview
    if (newFile && newFile.type.includes("image")) {
      const url = URL.createObjectURL(newFile);
      setFilePreview(url);
    } else {
      setFilePreview(null); // No preview for PDF
    }
  };

  const onSubmit = async (data: CreateEventForm) => {
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
        type: selectedType.toLowerCase(), // Add selected event type
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
      setValue("address", selectedAddress); // Ensure React Hook Form updates
    },
    options: {
      types: ["geocode"],
      componentRestrictions: { country: "us" },
    },
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center pt-64 pb-8 px-4">
      <Card className="w-full max-w-lg mx-auto shadow-sm bg-white border border-gray-300">
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
                aria-label="Event Title"
                variant="bordered"
                {...register("title", { required: "Title is required" })}
                errorMessage={errors.title?.message}
              />

              <div className="flex gap-4">
                <Input
                  isRequired
                  type="date"
                  label="Start Date"
                  aria-label="Start Date"
                  variant="bordered"
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                  errorMessage={errors.startDate?.message}
                />
                <Input
                  isRequired
                  type="date"
                  label="End Date"
                  aria-label="End Date"
                  variant="bordered"
                  {...register("endDate", { required: "End date is required" })}
                  errorMessage={errors.endDate?.message}
                />
              </div>

              <div className="flex gap-4">
                <TimeInput
                  label="Event Start Time"
                  aria-label="Event Start Time"
                  value={startTime}
                  variant="bordered"
                  onChange={(newValue) => setStartTime(newValue)}
                  errorMessage={errors.startTime?.message}
                />
                <TimeInput
                  label="Event End Time"
                  aria-label="Event End Time"
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
                    aria-label="Event Description"
                    variant="bordered"
                    {...register("description")}
                    errorMessage={errors.description?.message}
                    style={{ height: "200px", resize: "none" }}
                  />

                   {/* File input for image/PDF */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Flyer / Attachment
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                  {filePreview && isImageFile && (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="mt-2 w-48 h-auto border border-gray-200 rounded"
                    />
                  )}
                  </div>
                </div>
                {/* Image Dropzone */}
                <div>
                  {/* Uncomment to show URL and Thumbnail links */}
                  {/* {urls?.url && <Link href={urls.url} target="_blank">URL</Link>}
                {urls?.thumbnailUrl && (
                  <Link href={urls.thumbnailUrl} target="_blank">THUMBNAIL</Link>
                )} */}
                </div>
              </div>

              {/* Event Type  */}
              <Input
                isRequired
                label="Event Type"
                aria-label="Event Type"
                variant="bordered"
                placeholder="e.g. seminar, workshop, meeting"
                value={selectedType}
                onChange={(e) => {
                  const lowercase = e.target.value.toLowerCase();
                  setSelectedType(lowercase);
                  setValue("type", lowercase, { shouldValidate: true });
                }}
                onBlur={() => {
                  const trimmed = selectedType.trim().toLowerCase();
                  setSelectedType(trimmed);
                  setValue("type", trimmed, { shouldValidate: true });
                }}
                errorMessage={errors.type?.message}
              />
              
              {errors.type && (
                <p className="text-red-500">{errors.type.message}</p>
              )}

              {/* Autocomplete Address Input */}
              <Input
                label="Event Address"
                aria-label="Event Address"
                ref={ref as unknown as React.RefObject<HTMLInputElement>}
                variant="bordered"
                placeholder="Enter event location"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                errorMessage={errors.address?.message}
              />

              <Input
                label="Event Website"
                aria-label="Event Website"
                variant="bordered"
                {...register("website")}
                errorMessage={errors.website?.message}
                placeholder="For the use of external webpages"
              />

              <Button
                isDisabled={!isFormValid}
                fullWidth
                type="submit"
                className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black"
              >
                Submit Event
              </Button>
              <div className="text-[#757575]" style={{ fontSize: "12px" }}>
                Note: Title, Start & End Dates, and Type are required, plus
                either a Description or Flyer. Other fields are optional.
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
