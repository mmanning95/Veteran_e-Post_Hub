import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProfilePage from "@/app/Member/profile/edit/page";
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
      if (url.includes("/api/members/profile")) {
        return new Response(
          JSON.stringify({
            id: "1",
            name: "Member User",
            email: "member@example.com",
            role: "MEMBER",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      if (url.includes("/api/members/profile/edit")) {
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

    await waitFor(() => screen.getByText("Edit Member Profile"));

    expect(screen.getByLabelText("Name")).toHaveValue("Member User");
    expect(screen.getByLabelText("Email")).toHaveValue("member@example.com");
  });

  it("updates profile fields when typing", async () => {
    render(<EditProfilePage />);
    await waitFor(() => screen.getByText("Edit Member Profile"));

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "New Member Name" } });

    expect(nameInput).toHaveValue("New Member Name");
  });

  it("saves the updated profile", async () => {
    render(<EditProfilePage />);
    await waitFor(() => screen.getByText("Edit Member Profile"));

    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/members/profile/edit",
        expect.objectContaining({
          method: "PUT",
        })
      );
    });
  });
});
