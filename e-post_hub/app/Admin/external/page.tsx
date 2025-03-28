"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
} from "@nextui-org/react";
import jwt from "jsonwebtoken";
import Link from "next/link";

export default function AddExternalLinkPage() {
  // Hardcoded categories
  const categories = [
    { id: "1", name: "Volunteer" },
    { id: "2", name: "Financial Assistance" },
    { id: "3", name: "Healthcare" },
    { id: "4", name: "Legal Advice" },
  ];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    location: "Moscow", // Default location
    category: "", // Updated to use category name instead of categoryId
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [error, setError] = useState<string | null>(null); // Store error messages
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null); // Display success/error messages
  const [isAdmin, setIsAdmin] = useState(false); // Verify admin status

  // Check if the user is an admin
  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwt.decode(token) as { role: string };
        if (decodedToken && decodedToken.role === "ADMIN") {
          setIsAdmin(true); // Set admin state if valid
        } else {
          window.location.href = "/Unauthorized"; // Redirect if not an admin
        }
      } catch (error) {
        console.error("Invalid token:", error);
        window.location.href = "/Unauthorized"; // Redirect if token is invalid
      }
    } else {
      window.location.href = "/Unauthorized"; // Redirect if no token is present
    }
  }, []);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/externalHub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Send form data
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to submit the link.");
      }

      setMessage({ type: "success", text: "Link added successfully!" }); // Show success message
      setFormData({
        title: "",
        description: "",
        url: "",
        location: "Moscow",
        category: "", // Reset category
      });
    } catch (err: any) {
      setError(err.message); // Handle errors
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading screen until admin status is verified
  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Card className="w-full md:w-3/5 lg:w-3/5 mx-auto md:mt-5 lg:mt-5">
        <CardHeader className="flex flex-col items-center justify-center">
          <h3 className="text-3xl font-semibold text-black">
            Add External Link
          </h3>
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
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                isRequired
                isClearable
                label="Link Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                variant="bordered"
                placeholder="Enter the title of the link"
              />
              <Input
                isRequired
                isClearable
                label="URL"
                name="url"
                value={formData.url}
                onChange={handleChange}
                variant="bordered"
                placeholder="Enter the URL"
              />
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="bordered"
                placeholder="Enter a brief description of the link"
              />
              <div className="mb-4">
                <label className="block font-semibold mb-2">Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full p-2"
                >
                  <option value="Moscow">Moscow</option>
                  <option value="Pullman">Pullman</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category} // Updated to use `category`
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full p-2"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  fullWidth
                  className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-black border border-black"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Add Link"}
                </Button>


              </div>
              <Button
                  fullWidth
                  as={Link}
                  href="/Support/external"
                  className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-black border border-black mt-2"
                >
                  Return to resources
                </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
