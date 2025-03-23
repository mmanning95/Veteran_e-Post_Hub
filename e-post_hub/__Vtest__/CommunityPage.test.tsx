import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CommunityPage from "@/app/Support/community/page";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

describe("CommunityPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem(key: string) {
          return store[key] || null;
        },
        setItem(key: string, value: string) {
          store[key] = value;
        },
        removeItem(key: string) {
          delete store[key];
        },
        clear() {
          store = {};
        },
      };
    })();
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders community questions and handles comment toggle", async () => {
    // Mock fetch responses
    vi.stubGlobal("fetch", vi.fn((url: RequestInfo) => {
      if (typeof url === "string") {
        if (url.endsWith("/api/community/question/public")) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              questions: [
                {
                  id: "q1",
                  text: "What benefits are available?",
                  username: "Veteran Joe",
                  datePosted: new Date().toISOString(),
                },
              ],
            }),
          });
        }

        if (url.includes("/comments/count")) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ count: 2 }),
          });
        }

        if (url.includes("/comments")) {
          return Promise.resolve({
            ok: true,
            json: async () => [
              {
                id: "c1",
                content: "Check the VA website",
                createdAt: new Date().toISOString(),
                createdBy: { name: "Helper Hank", email: "hank@example.com" },
              },
            ],
          });
        }
      }

      return Promise.resolve({ ok: false, json: async () => ({}) });
    }) as any);

    render(<CommunityPage />);

    expect(await screen.findByText("Community Questions")).toBeInTheDocument();
    expect(await screen.findByText("What benefits are available?")).toBeInTheDocument();

    const toggleButton = await screen.findByRole("button", { name: /show comments/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText("Check the VA website")).toBeInTheDocument();
    });
  });
});