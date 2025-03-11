"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();

  // Form fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // validation error messages
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Server response message
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  // Handle changes with immediate validation
  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOldPassword(value);
    if (value.length < 6 && value.length > 0) {
      setOldPasswordError("Must be at least 6 characters.");
    } else {
      setOldPasswordError("");
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    if (value.length < 6 && value.length > 0) {
      setNewPasswordError("Must be at least 6 characters.");
    } else {
      setNewPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value.length < 6 && value.length > 0) {
      setConfirmPasswordError("Must be at least 6 characters.");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Check if newPassword and confirmPassword match
  const passwordsMatch = newPassword === confirmPassword;

  // Disable the button if:
  // - any field is empty
  // - or there's any error
  // - or new & confirm don't match
  const isButtonDisabled =
    !oldPassword ||
    !newPassword ||
    !confirmPassword ||
    !!oldPasswordError ||
    !!newPasswordError ||
    !!confirmPasswordError ||
    !passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMessage(null); // clear old message

    // If they still don't match, set an error just in case
    if (!passwordsMatch) {
      setConfirmPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setServerMessage("You are not logged in. Please log in first.");
        return;
      }

      // Make the API request
      const response = await fetch("/api/updatePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        // Server returned an error, e.g. "Old password is incorrect"
        setServerMessage(data.message || "Error updating password.");
      } else {
        setServerMessage(data.message || "Password updated successfully!");
        setTimeout(() => {
          router.push("/Admin/profile");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setServerMessage("An error occurred. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-semibold">Update Password</h2>
      </CardHeader>
      <CardBody>
        {/* Server error or success messages */}
        {serverMessage && (
          <p className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4 text-center">
            {serverMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Old Password Field */}
          <div>
            <label className="block font-medium mb-1" htmlFor="oldPassword">
              Old Password:
            </label>
            <input
              id="oldPassword"
              type="password"
              className={`w-full p-2 border rounded ${
                oldPasswordError ? "border-red-500" : ""
              }`}
              value={oldPassword}
              onChange={handleOldPasswordChange}
            />
            {oldPasswordError && (
              <p className="text-red-500 text-sm mt-1">{oldPasswordError}</p>
            )}
          </div>

          {/* New Password Field */}
          <div>
            <label className="block font-medium mb-1" htmlFor="newPassword">
              New Password:
            </label>
            <input
              id="newPassword"
              type="password"
              className={`w-full p-2 border rounded ${
                newPasswordError ? "border-red-500" : ""
              }`}
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            {newPasswordError && (
              <p className="text-red-500 text-sm mt-1">{newPasswordError}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block font-medium mb-1" htmlFor="confirmPassword">
              Confirm New Password:
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`w-full p-2 border rounded ${
                confirmPasswordError || (!passwordsMatch && confirmPassword)
                  ? "border-red-500"
                  : ""
              }`}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </p>
            )}
            {!confirmPasswordError && confirmPassword && !passwordsMatch && (
              <p className="text-red-500 text-sm mt-1">
                New password and confirm password do not match.
              </p>
            )}
          </div>

          {/* Update Password Button */}
          <Button
            color="warning"
            variant="solid"
            type="submit"
            className="mt-4 bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black w-full"
            isDisabled={isButtonDisabled}
          >
            Update Password
          </Button>

          {/* Cancel / Back Button (optional) */}
          <Button
            color="secondary"
            variant="solid"
            className="mt-4 bg-gradient-to-r from-[#eb4843] to-[#f95d09] border border-black text-black w-full"
            onClick={() => router.push("/Admin/profile")}
          >
            Cancel
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
