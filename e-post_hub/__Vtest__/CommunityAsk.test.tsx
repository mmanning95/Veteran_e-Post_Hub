import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AskPage from "@/app/Support/community/ask/page";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("AskPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it("renders the ask form correctly", () => {
    render(<AskPage />);
    expect(screen.getByText("Public")).toBeInTheDocument();
    expect(screen.getByText("Private")).toBeInTheDocument();
  });

  it("requires name and email for private questions when not logged in", async () => {
    render(<AskPage />);
    fireEvent.click(screen.getByText("Post Question"));

    await waitFor(() => {
      expect(screen.getByText(/please provide both your name/i)).toBeInTheDocument();
    });
  });

  it("submits a private question with valid name + email (not logged in)", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<AskPage />);

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your contact email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/details of your question/i), {
      target: { value: "This is a test question" },
    });

    fireEvent.click(screen.getByText("Post Question"));

    await waitFor(() => {
      expect(screen.getByText(/question posted successfully/i)).toBeInTheDocument();
    });
  });

  it("submits as logged-in user without name/email", async () => {
    localStorage.setItem("token", "mock.token.value");

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<AskPage />);

    fireEvent.change(screen.getByPlaceholderText(/details of your question/i), {
      target: { value: "Logged-in test question" },
    });

    fireEvent.click(screen.getByText("Post Question"));

    await waitFor(() => {
      expect(screen.getByText(/question posted successfully/i)).toBeInTheDocument();
    });
  });
});
