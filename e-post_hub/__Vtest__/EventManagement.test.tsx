import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EventManagement from "@/app/Admin/event/management/page";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

vi.mock("jsonwebtoken", async () => {
    const actual = await vi.importActual<typeof import("jsonwebtoken")>("jsonwebtoken");
    return {
      ...actual,
      default: {
        ...actual,
        decode: vi.fn(() => ({ role: "ADMIN" })), // Mock admin token decoding
      },
    };
  });

describe("EventManagement Page", () => {
    beforeEach(() => {
        localStorage.setItem("token", "mocked_token");
      
        global.fetch = vi.fn(async (url) => {
          if (url.includes("/api/Event/pending")) {
            return new Response(
              JSON.stringify({
                events: [
                  {
                    id: "1",
                    title: "Mock Event",
                    createdBy: { name: "John Doe", email: "john@example.com" },
                    status: "PENDING",
                  },
                ],
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }
      
          if (url.includes("/api/community/question/private")) {
            return new Response(
              JSON.stringify({
                questions: [
                  {
                    id: "1",
                    text: "Is this event family-friendly?",
                    username: "Jane Doe",
                    userEmail: "jane@example.com",
                    datePosted: "2024-03-19T12:00:00Z",
                  },
                ],
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }
      
          if (url.includes("/api/Event/approve")) {
            return new Response(null, { status: 200 });
          }
      
          if (url.includes("/api/Event/deny")) {
            return new Response(null, { status: 200 });
          }
      
          if (url.includes("/api/community/question/")) {
            return new Response(null, { status: 200 });
          }
      
          return new Response(null, { status: 404 });
        });
      });
            
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders the EventManagement page", async () => {
    render(<EventManagement />);
    expect(screen.getByText("Pending Events")).toBeInTheDocument();
    expect(screen.getByText("Private Questions")).toBeInTheDocument();
  });

  it("displays pending events", async () => {
    render(<EventManagement />);
    await waitFor(() => expect(screen.getByText("Mock Event")).toBeInTheDocument());
  });

  it("approves an event", async () => {
    render(<EventManagement />);
    await waitFor(() => screen.getByText("Pending Events"));

    const approveCheckbox = screen.getByLabelText("Approve");
    fireEvent.click(approveCheckbox);

    expect(approveCheckbox).toBeChecked();
  });

  it("denies an event with a rejection message", async () => {
    render(<EventManagement />);
    await waitFor(() => screen.getByText("Pending Events"));

    const denyCheckbox = screen.getByLabelText("Deny");
    fireEvent.click(denyCheckbox);

    expect(denyCheckbox).toBeChecked();

    const textarea = screen.getByPlaceholderText("Please enter a reason for rejection...");
    fireEvent.change(textarea, { target: { value: "Event does not meet requirements." } });

    expect(textarea).toHaveValue("Event does not meet requirements.");
  });


  it("resolves a private question", async () => {
    render(<EventManagement />);
  
    await waitFor(() => screen.getByText("Private Questions"));
  
    const resolveButton = screen.getByText("Resolved");
    fireEvent.click(resolveButton);
  
    await waitFor(() => screen.getByText("Question resolved successfully."));
  });
  
});
