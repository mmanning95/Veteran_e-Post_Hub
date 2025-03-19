import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProfilePage from "@/app/Admin/profile/edit/page";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe("EditProfilePage", () => {
  beforeEach(() => {
    localStorage.setItem("token", "mocked_token");

    global.fetch = vi.fn(async (url) => {
      if (url.includes("/api/admins/profile")) {
        return new Response(
          JSON.stringify({
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            officeNumber: "123-456-7890",
            officeHours: "9 AM - 5 PM",
            officeLocation: "Room 101",
            role: "ADMIN",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      if (url.includes("/api/admins/profile/edit")) {
        return new Response(null, { status: 200 });
      }

      return new Response(null, { status: 404 });
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders the Edit Profile page", async () => {
    render(<EditProfilePage />);
    expect(screen.getByText("Loading profile...")).toBeInTheDocument();

    await waitFor(() => screen.getByText("Edit Admin Profile"));

    expect(screen.getByLabelText("Name")).toHaveValue("Admin User");
    expect(screen.getByLabelText("Email")).toHaveValue("admin@example.com");
  });

  it("updates profile fields when typing", async () => {
    render(<EditProfilePage />);
    await waitFor(() => screen.getByText("Edit Admin Profile"));

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "New Admin Name" } });

    expect(nameInput).toHaveValue("New Admin Name");
  });

  it("saves the updated profile", async () => {
    render(<EditProfilePage />);
    await waitFor(() => screen.getByText("Edit Admin Profile"));

    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/admins/profile/edit",
        expect.objectContaining({
          method: "PUT",
        })
      );
    });
  });
});
