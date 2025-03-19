"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";

const NewCreatorCode = () => {
  const router = useRouter();

  const [creatorCode, setCreatorCode] = useState("");
  const [currentCreatorCode, setCurrentCreatorCode] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);

  // Check admin status and fetch creator code.
  useEffect(() => {
    const fetchCreatorCode = async () => {
      try {
        const response = await fetch("/api/admins");
        if (response.ok) {
          const { creatorCode } = await response.json();
          setCurrentCreatorCode(creatorCode); // Update creator code.
        } else {
          console.error("Failed to fetch the current creator code.");
          setCurrentCreatorCode(null);
        }
      } catch (error) {
        console.error("Error fetching the current creator code:", error);
        setCurrentCreatorCode(null);
      }
    };

    // check for valid JWT token
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/Unauthorized"); 
      return;
    }

    if (token) {
      try {
        // Verify and decode the token to determine if the user is an admin
        const decodedToken = jwt.decode(token) as {
          userId: string;
          role: string;
          name?: string;
        };
        if (!decodedToken || decodedToken.role !== "ADMIN") {
          router.push("/Unauthorized");
        } else{
          setIsAdmin(true);
          setAdminName(decodedToken.name || "Admin");
          fetchCreatorCode(); // Fetch the current creator code if the user is an 
        }
        } catch (error) {
        router.replace("/Unauthorized"); // Redirect to homepage if the token is invalid
      }
    } else {
      window.location.href = "/Unauthorized";
    }
  }, []);

  // handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Post request to update
    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newCreatorCode: creatorCode }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Creator code updated successfully!");
        setCurrentCreatorCode(creatorCode); // Update the current code displayed
      } else {
        setMessage(result.error || "Failed to update the creator code.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  // Loading message until user is verified as admin
  // if (!isAdmin) {
  //   return <div>Loading...</div>;
  // }

  // Render UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold text-orange-500">
            Update Creator Code
          </h1>
          <p className="text-neutral-500 mt-2">
            Current Creator Code:{" "}
            <span className="font-bold text-black">
              {currentCreatorCode || creatorCode || "wc_create_admin"}
            </span>
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {message && (
                <p role="alert" className="text-green-500">
                  {message}
                </p>
              )}
              <Input
                isRequired
                defaultValue=""
                label="New Creator Code"
                variant="bordered"
                value={creatorCode}
                onChange={(e) => setCreatorCode(e.target.value)}
                placeholder="Enter the new creator code"
              />
              <Button
                isDisabled={!creatorCode.trim()}
                fullWidth
                className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
          <div className="text-neutral-500">
            Note: This code is used for creating new admin accounts and can be
            changed at anytime.
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default NewCreatorCode;
