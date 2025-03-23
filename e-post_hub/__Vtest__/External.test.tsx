import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ResourcesPage from "@/app/Support/external/page";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockLinks = [
  {
    id: "1",
    title: "Test Resource",
    description: "Helpful resource for veterans",
    url: "www.test.com",
    location: "Moscow",
    category: "Healthcare",
  },
];

global.fetch = vi.fn(() =>
    Promise.resolve(
      new Response(
        JSON.stringify([
          {
            id: "1",
            title: "Veteran Health",
            description: "Health services for veterans.",
            url: "https://veteranhealth.example.com",
            location: "Moscow",
            category: "Healthcare",
          },
        ]),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    )
  ) as typeof fetch;
  

describe("ResourcesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders external resource links", async () => {
    render(<ResourcesPage />);

    await waitFor(() => {
        expect(screen.getByText("Veteran Health")).toBeInTheDocument();
        expect(screen.getByText("Health services for veterans.")).toBeInTheDocument();
            });
  });

  it("filters by location", async () => {
    render(<ResourcesPage />);

    fireEvent.click(screen.getByText("Locations +"));
    fireEvent.click(screen.getByText("Moscow"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/externalHub?location=Moscow");
    });
  });

  it("filters by category", async () => {
    render(<ResourcesPage />);

    fireEvent.click(screen.getByText("Categories +"));
    fireEvent.click(screen.getByText("Healthcare"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/externalHub?category=Healthcare");
    });
  });

  it("displays message when no links found", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<ResourcesPage />);

    await waitFor(() => {
      expect(screen.getByText("No links found for the selected filters.")).toBeInTheDocument();
    });
  });
});
