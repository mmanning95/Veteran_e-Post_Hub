"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";

type MemberProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function ProfilePage() {
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("No token found. Please log in.");
            setLoading(false);
            return;
          }

          const response = await fetch("/api/members/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            if (profileData.role !== "MEMBER") {
              window.location.href = "/not-authorized";
              return;
            }
            setMemberProfile(profileData);
          } else {
            const errorResponse = await response.json();
            setError(`Failed to fetch profile: ${errorResponse.message}`);
          }
        } catch (error) {
          setError("An error occurred while fetching the profile");
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, []);

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/members/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Account deleted successfully.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        const errorResponse = await response.json();
        alert(`Failed to delete account: ${errorResponse.message}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the account.");
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-semibold">Member Profile</h2>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="flex flex-col gap-4 self-center">
          <p>
            <strong>Name:</strong> {memberProfile?.name}
          </p>
          <p>
            <strong>Email:</strong> {memberProfile?.email}
          </p>
        </div>

        <Button
          className="hover:scale-95 transition-transform duration-200 ease-in-out mt-4 bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black w-full"
          onClick={() => (window.location.href = "/Member")}
        >
          Back to Dashboard
        </Button>

        <Button
          className="hover:scale-95 transition-transform duration-200 ease-in-out mt-4 bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black w-full"
          onClick={() => (window.location.href = "/Member/profile/edit")}
        >
          Edit Profile
        </Button>

        <Button
          className="hover:scale-95 transition-transform duration-200 ease-in-out mt-4 bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black w-full"
          onClick={() => (window.location.href = "/UpdatePassword")}
        >
          Update Password
        </Button>

        <Button
          className="hover:scale-95 transition-transform duration-200 ease-in-out mt-4 bg-gradient-to-r from-[#f54949] to-[#f95d09] border border-black text-black w-full"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </Button>
      </CardBody>
    </Card>
  );
}
