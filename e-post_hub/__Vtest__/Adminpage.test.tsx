import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Adminpage from "../app/Admin/page";
import "@testing-library/jest-dom";
import React from "react";
import { useRouter } from "next/navigation";

// Mock next/navigation's router
const mockRouterReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}));

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("../app/Components/Calendar/EventCalendar", () => ({
  default: () => <div data-testid="event-calendar">Mocked Calendar</div>,
}));

vi.mock("../app/Components/BottomBar/BottomBar", () => ({
  default: () => <div data-testid="bottom-bar">Mocked Bottom Bar</div>,
}));

describe("Adminpage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should redirect unauthorized users immediately", async () => {
    render(<Adminpage />);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith("/Unauthorized");
    });
  });

  it("should render the admin page correctly for an admin user", async () => {
    localStorage.setItem(
      "token",
      JSON.stringify({ userId: "123", role: "ADMIN", name: "Admin User" })
    );

    render(<Adminpage />);

    await waitFor(() => {
      expect(screen.getByText("Welcome to Whitman county veteran page")).toBeInTheDocument();
    });

    expect(screen.getByTestId("event-calendar")).toBeInTheDocument();
    expect(screen.getByTestId("bottom-bar")).toBeInTheDocument();
  });  

});
