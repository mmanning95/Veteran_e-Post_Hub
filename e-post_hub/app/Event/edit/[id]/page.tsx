"use client";

import React, { useEffect, useState } from "react";
import { Button, Textarea, Input,Card, CardBody, CardHeader,
   TimeInput, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { usePlacesWidget } from "react-google-autocomplete";

export default function EditEventPage({ params }: { params: { id: string } }) {
  const eventId = params.id;

  // State for event details
  const [event, setEvent] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");

  // Fetch event details when page loads
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/Event/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data.event);

          setEditTitle(data.event.title || "");
          setEditDescription(data.event.description || "");
          setEditType(data.event.type || "");
          setEditAddress(data.event.address || "");
          setEditWebsite(data.event.website || "");
          setEditStartDate(adjustDateForDisplay(data.event.startDate));
          setEditEndDate(adjustDateForDisplay(data.event.endDate));
        } else {
          setMessage("Failed to fetch event details.");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        setMessage("An error occurred while fetching event details.");
      }
    };

    fetchEventDetails();
  }, [eventId]);

  // Adjust Date Offset (Fix the 1-day issue)
  const adjustDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const adjustDateForSaving = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const { ref } = usePlacesWidget<HTMLInputElement>({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    onPlaceSelected: (place) => {
      const selectedAddress = place.formatted_address || "";
      setEditAddress(selectedAddress);
    },
    options: {
      types: ["geocode"],
      componentRestrictions: { country: "us" },
    },
  });

  const handleSaveEvent = async () => {
    const updatedEvent = {
      title: editTitle,
      description: editDescription,
      type: editType,
      address: editAddress,
      website: editWebsite,
      startDate: adjustDateForSaving(editStartDate),
      endDate: adjustDateForSaving(editEndDate),
    };

    try {
      const response = await fetch(`/api/Event/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        setMessage("Failed to update event.");
        return;
      }

      setMessage("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      setMessage("An error occurred while updating the event.");
    }

    setTimeout(() => {
      window.location.href = `/Event/${eventId}`;
    }, 2000);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-2/5 mx-auto max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-col items-center justify-center">
          <h3 className="text-3xl font-semibold">Edit Event</h3>
        </CardHeader>
        <CardBody>
          {/* Message Display */}
          {message && <div className="p-2 mb-4 bg-yellow-100 text-yellow-800 rounded">{message}</div>}

          <div className="space-y-4">
            <Input
              isRequired
              label="Event Title"
              variant="bordered"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <div className="flex gap-4">
              <Input
                isRequired
                type="date"
                label="Start Date"
                variant="bordered"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
              />
              <Input
                isRequired
                type="date"
                label="End Date"
                variant="bordered"
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
              />
            </div>

            <Textarea
              minRows={6}
              label="Event Description"
              variant="bordered"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            <Input
              label="Event Type"
              variant="bordered"
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
            />

            {/* Address Autocomplete */}
            <Input
              label="Event Address"
              ref={ref as unknown as React.RefObject<HTMLInputElement>}
              variant="bordered"
              placeholder="Enter event location"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
            />

            <Input
              label="Event Website"
              variant="bordered"
              value={editWebsite}
              onChange={(e) => setEditWebsite(e.target.value)}
              placeholder="For external webpages"
            />

            {/* Save and Cancel Buttons */}
            <div className="flex gap-4">
              <Button onClick={handleSaveEvent} className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black">
                Save
              </Button>
              <a href={`/Event/${eventId}`}>
                <Button className="bg-gradient-to-r from-[#f7584c] to-[#ff0505] border border-black">
                  Cancel
                </Button>
              </a>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-semibold">Edit Event</h1>

//       {message && <div className="p-2 mb-4 bg-yellow-100 text-yellow-800 rounded">{message}</div>}

//       <div className="w-3/4">
//         <label className="text-sm font-semibold">Title:</label>
//         <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="mb-2" />

//         <label className="text-sm font-semibold">Description:</label>
//         <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="mb-2" />

//         <label className="text-sm font-semibold">Event Type:</label>
//         <Input value={editType} onChange={(e) => setEditType(e.target.value)} className="mb-2" />

//         <label className="text-sm font-semibold">Event Address:</label>
//         <Input
//           label="Event Address"
//           ref={ref as unknown as React.RefObject<HTMLInputElement>}
//           variant="bordered"
//           placeholder="Enter event location"
//           value={editAddress}
//           onChange={(e) => setEditAddress(e.target.value)}
//         />

//         <label className="text-sm font-semibold">Start Date:</label>
//         <Input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} className="mb-2" />

//         <label className="text-sm font-semibold">End Date:</label>
//         <Input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} className="mb-2" />

//         <label className="text-sm font-semibold">Website:</label>
//         <Input value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)} className="mb-2" />

//         <div className="flex gap-4">
//           <Button onClick={handleSaveEvent} className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black">
//             Save
//           </Button>
//           <a href={`/Event/${eventId}`}>
//             <Button className="bg-gradient-to-r from-[#f7584c] to-[#ff0505] border border-black">
//               Cancel
//             </Button>
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }
