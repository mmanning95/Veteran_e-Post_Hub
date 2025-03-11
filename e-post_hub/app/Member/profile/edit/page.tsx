"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, Input } from "@nextui-org/react";

// Define the type for AdminProfile with optional properties
// This ensures that TypeScript knows the structure of the admin profile object
type MemberProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

//States to store data
export default function EditProfilePage() {
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch the current user's profile details from the API
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/members/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          setMemberProfile(profileData);
        } else {
          const errorResponse = await response.json();
          setError(`Failed to fetch profile: ${errorResponse.message}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(
            `An error occurred while fetching the profile: ${error.message}`
          );
        } else {
          setError("An unknown error occurred while fetching the profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!memberProfile) return;

    setIsSaving(true);
    setEmailError(null); // Reset email error before attempting save

    try {
      const response = await fetch("/api/members/profile/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(memberProfile),
      });

      // Log response details to debug issues
      console.log("Response status:", response.status);
      console.log("Response:", response);

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        const errorResponse = await response.json();
        if (response.status === 409) {
          // Handle email conflict error
          setEmailError(errorResponse.message);
        } else {
          setError(`Failed to save changes: ${errorResponse.message}`);
        }
      }
    } catch (error) {
      console.error("An error occurred while saving the profile:", error);
      setError(
        error instanceof Error
          ? `An error occurred while saving the profile: ${error.message}`
          : "An unknown error occurred while saving the profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  //loading indicator for slower processes
  if (loading) {
    return <div>Loading profile...</div>;
  }

  //Displays error messages
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-semibold">Edit Member Profile</h2>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="flex flex-col gap-4">
          <Input
            label="Name"
            value={memberProfile?.name ?? ""}
            onChange={(e) =>
              setMemberProfile((prev) => ({
                ...(prev as MemberProfile),
                name: e.target.value,
              }))
            }
            variant="bordered"
          />

          <div>
            <Input
              label="Email"
              value={memberProfile?.email ?? ""}
              onChange={(e) =>
                setMemberProfile((prev) => ({
                  ...(prev as MemberProfile),
                  email: e.target.value,
                }))
              }
              variant="bordered"
              errorMessage={emailError ?? ""}
            />
            {emailError && (
              <p className="text-red-500 mt-1 text-sm">{emailError}</p>
            )}
          </div>
        </div>

        <Button
          className="bg-orange-400 text-white mt-4"
          onClick={handleSave}
          isDisabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>

        <Button
          className="bg-orange-400 text-white mt-4"
          onClick={() => (window.location.href = "/Member")}
        >
          Back to Member Dashboard
        </Button>
      </CardBody>
    </Card>
  );
}
