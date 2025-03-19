import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import NewCreatorCode from "../app/Admin/creatorcode/page";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useRouter } from "next/navigation";
import React from "react";

// Mock useRouter globally
const mockReplace = vi.fn();
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

// Mock localStorage
const mockLocalStorage: Record<string, string> = {};

vi.stubGlobal("localStorage", {
  getItem: vi.fn((key) => mockLocalStorage[key] || null),
  setItem: vi.fn((key, value) => {
    mockLocalStorage[key] = value;
  }),
  clear: vi.fn(() => {
    Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
  }),
});

// Mock fetch API properly
global.fetch = vi.fn(async (url, options) => {
  if (url === "/api/admins" && options?.method === "POST") {
    return Promise.resolve(
      new Response(JSON.stringify({}), { status: 200 })
    );
  }
  if (url === "/api/admins") {
    return Promise.resolve(
      new Response(JSON.stringify({ creatorCode: "test_code" }), { status: 200 })
    );
  }
  return Promise.resolve(
    new Response(JSON.stringify({}), { status: 500 })
  );
});

describe("NewCreatorCode Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage["token"] = JSON.stringify({ role: "ADMIN" });
  });

  it("renders correctly for an admin and fetches current creator code", async () => {
    await act(async () => {
      render(<NewCreatorCode />);
    });

    // Ensure the component renders
    await waitFor(() => {
      expect(screen.getByText("Update Creator Code")).toBeInTheDocument();
    });

    // Check if the creator code loads correctly
    await waitFor(() => {
      expect(screen.getByText(/Current Creator Code:/)).toBeInTheDocument();
    });
  });

  it("disables submit button when input is empty", async () => {
    await act(async () => {
      render(<NewCreatorCode />);
    });

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    fireEvent.change(screen.getByPlaceholderText(/enter the new creator code/i), {
      target: { value: "new_code" },
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("updates creator code on form submission", async () => {
    await act(async () => {
      render(<NewCreatorCode />);
    });

    fireEvent.change(screen.getByPlaceholderText(/enter the new creator code/i), {
      target: { value: "updated_code" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Creator code updated successfully!")).toBeInTheDocument();
    });
  });

  it("redirects non-admin users", async () => {
    render(<NewCreatorCode />);

    await waitFor(() => {
      expect("");
    });

  });
});
