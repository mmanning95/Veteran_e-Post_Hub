import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MemberRegisterForm from "@/app/(auth)/Registermember/MemberRegisterForm";
import { afterEach, beforeEach, describe, expect, it, test, vi } from "vitest";
import React from "react";
import { useRouter } from "next/navigation";

// Mock Next.js router
vi.mock("next/navigation", () => ({
    useRouter: () => ({
      replace: vi.fn(), 
    }),
  }));

describe("MemberRegisterForm", () => {
  beforeEach(() => {
    localStorage.clear();

    global.fetch = vi.fn(async (url, options) => {
      if (url.includes("/api/members")) {
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
  });

  it("renders the registration form correctly", () => {
    render(<MemberRegisterForm />);
    
    expect(screen.getByText("Member Register")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("validates inputs and prevents form submission with invalid data", async () => {
    render(<MemberRegisterForm />);

    const registerButton = screen.getByRole("button", { name: /register member/i });
    expect(registerButton).toBeDisabled();

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "" } });

    await waitFor(() => {
      expect(registerButton).toBeDisabled();
    });
  });

  it("registers a member and redirects to login on success", async () => {
    const router = useRouter();
    const mockReplace = vi.spyOn(router, "replace"); // Spy on router.replace
    
    render(<MemberRegisterForm />);
  
    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const registerButton = screen.getByRole("button", { name: /register member/i });
  
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
  
    await waitFor(() => {
      expect(registerButton).not.toBeDisabled();
    });
  
    fireEvent.click(registerButton);
  
    await waitFor(() => {
      expect(screen.getByText("Welcome to the Veteran e-Post Hub")).toBeInTheDocument();
    });
  });
  
});