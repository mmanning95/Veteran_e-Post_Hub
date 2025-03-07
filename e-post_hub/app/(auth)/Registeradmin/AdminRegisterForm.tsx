"use client";

import {
  adminRegisterSchema,
  AdminRegisterSchema,
} from "@/lib/schemas/adminRegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";

export default function AdminRegisterForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to store error messages
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<AdminRegisterSchema>({
    resolver: zodResolver(adminRegisterSchema),
    mode: "onTouched",
  });

  // Creator code needed for admin account creation
  const creatorCode = watch("creatorCode");

  const onSubmit = async (data: AdminRegisterSchema) => {
    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);

        // Redirect to the admin page
        window.location.href = "/Admin";
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "An error occurred.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-orange-500">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">Admin Register</h1>
          </div>
          <p className="text-neutral-500">Welcome to the Veteran e-Post Hub</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {errorMessage && (
              <p role="alert" className="text-red-500">
                {errorMessage}
              </p>
            )}
            <Input
              isRequired
              defaultValue=""
              label="Name"
              variant="bordered"
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              autoComplete="name"
            />
            <Input
              defaultValue=""
              label="Office Number"
              variant="bordered"
              {...register("officeNumber")}
              isInvalid={!!errors.officeNumber}
              errorMessage={errors.officeNumber?.message}
            />
            <Input
              defaultValue=""
              label="Office Hours"
              variant="bordered"
              {...register("officeHours")}
              isInvalid={!!errors.officeHours}
              errorMessage={errors.officeHours?.message}
            />
            <Input
              defaultValue=""
              label="Office Location"
              variant="bordered"
              {...register("officeLocation")}
              isInvalid={!!errors.officeLocation}
              errorMessage={errors.officeLocation?.message}
            />
            <Input
              isRequired
              defaultValue=""
              label="Email"
              variant="bordered"
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              autoComplete="email"
            />
            <Input
              isRequired
              defaultValue=""
              label="Password"
              variant="bordered"
              type="password"
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            <Input
              isRequired
              defaultValue=""
              label="Creator Code"
              variant="bordered"
              {...register("creatorCode")}
              isInvalid={!!errors.creatorCode}
              errorMessage={errors.creatorCode?.message}
            />
            <Button
              isDisabled={!isValid || !creatorCode?.trim()}
              fullWidth
              className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black"
              type="submit"
            >
              Register Admin
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
