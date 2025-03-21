import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminRegisterForm from "@/app/(auth)/Registeradmin/AdminRegisterForm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { useRouter } from "next/navigation";

// Properly mock Next.js router with replace as a mock function
const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace, // Mock function
  }),
}));

describe("AdminRegisterForm", () => {
  beforeEach(() => {
    localStorage.clear();

    global.fetch = vi.fn(async (url) => {
      if (url.includes("/api/admins")) {
        return new Response(
          JSON.stringify({ token: "mocked_token" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(null, { status: 404 });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockReplace.mockClear(); // Clear mock between tests
  });

  it("renders the registration form correctly", () => {
    render(<AdminRegisterForm />);
    
    expect(screen.getByText("Admin Register")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("validates inputs and prevents form submission with invalid data", async () => {
    render(<AdminRegisterForm />);

    const registerButton = screen.getByRole("button", { name: /register admin/i });
    expect(registerButton).toBeDisabled();

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "" } });

    await waitFor(() => {
      expect(registerButton).toBeDisabled();
    });
  });

  it("registers an admin and redirects to login on success", async () => {
    const router = useRouter();
    const mockReplace = vi.spyOn(router, "replace"); 
    render(<AdminRegisterForm />);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const creatorCodeInput = screen.getByLabelText("Creator Code"); // Added creator code input
    const registerButton = screen.getByRole("button", { name: /register admin/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(creatorCodeInput, { target: { value: "SECRET123" } });

    await waitFor(() => {
      expect(registerButton).not.toBeDisabled();
    });

    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText("Welcome to the Veteran e-Post Hub")).toBeInTheDocument();
    });
  });
});
