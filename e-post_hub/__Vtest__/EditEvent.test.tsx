import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditEventPage from "@/app/Event/edit/[id]/page";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock EdgeStore
vi.mock("@/lib/edgestore", () => ({
  useEdgeStore: () => ({
    edgestore: {
      myPublicImages: {
        upload: vi.fn().mockResolvedValue({ url: "mocked_flyer_url" }),
      },
    },
  }),
}));

describe("EditEventPage Component", () => {
  const mockEvent = {
    title: "Test Event",
    description: "This is a test description.",
    type: "Workshop",
    address: "123 Test St",
    website: "https://example.com",
    startDate: "2025-06-01",
    endDate: "2025-06-02",
    flyer: "https://mocked.flyer.url",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the fetch API to return the event details
    global.fetch = vi.fn(async (url) => {
      if (url.includes("/api/Event/")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ event: mockEvent }),
        } as Response);
      }
      return Promise.reject(new Error("API request failed"));
    });

    // Spy on `window.location.href`
    vi.spyOn(window, "location", "set");
  });

  it("renders the edit event form correctly", async () => {
    render(<EditEventPage params={{ id: "123" }} />);

    await waitFor(() => {
      expect(screen.getByText("Edit Event")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Event Title")).toHaveValue("Test Event");
    expect(screen.getByLabelText("Event Description")).toHaveValue("This is a test description.");
  });

  it("allows users to update event details", async () => {
    render(<EditEventPage params={{ id: "123" }} />);

    await waitFor(() => screen.getByLabelText("Event Title"));

    const titleInput = screen.getByLabelText("Event Title");
    fireEvent.change(titleInput, { target: { value: "Updated Event Title" } });

    expect(titleInput).toHaveValue("Updated Event Title");
  });

  it("submits the form and updates the event", async () => {
    render(<EditEventPage params={{ id: "123" }} />);

    await waitFor(() => screen.getByText("Edit Event"));

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(window.location.href).toBe("http://localhost:3000/");
    });
  });
});
