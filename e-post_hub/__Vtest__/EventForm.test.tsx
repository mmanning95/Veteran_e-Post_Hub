import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import EventForm from "@/app/Event/create/EventForm";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { EdgeStoreProvider } from "@/lib/edgestore";

// Wrap rendering with EdgeStoreProvider
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<EdgeStoreProvider>{ui}</EdgeStoreProvider>);
};

// Mock fetch for event submission
global.fetch = vi.fn(async (url, options) => {
  if (url === "/api/Event/create" && options?.method === "POST") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: "Event successfully created" }),
    } as Response);
  }
  return Promise.resolve({
    ok: false,
    json: () => Promise.resolve({ message: "Event creation failed" }),
  } as Response);
});

describe("EventForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form correctly", async () => {
    await act(async () => {
      renderWithProviders(<EventForm />);
    });

    expect(screen.getByText("Create New Event")).toBeInTheDocument();
  });

  it("validates required fields before submission", async () => {
    renderWithProviders(<EventForm />);
  
    const submitButton = screen.getByRole("button", { name: /submit event/i });
    expect(submitButton).toBeDisabled();
  
    // Fill out all required fields
    fireEvent.change(screen.getByLabelText(/event title/i), { target: { value: "My Event" } });
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: "2025-06-01" } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: "2025-06-02" } });
  
    // Use event selection properly for dropdowns/autocomplete
    const eventTypeInput = screen.getByLabelText(/event type/i);
    fireEvent.change(eventTypeInput, { target: { value: "Seminar" } });
    fireEvent.blur(eventTypeInput); // Simulate leaving the input to trigger validation
  
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    }, { timeout: 3000 }); 
  });
  

});
