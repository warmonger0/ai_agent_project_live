// File: /frontend/src/__tests__/ChatPanel.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import ChatPanel from "../components/planning/ChatPanel";
import { sendChatMessage } from "../lib/sendChatMessage";

// Mock the sendChatMessage function
vi.mock("../lib/sendChatMessage");

describe("ChatPanel Component", () => {
  const mockResponse = {
    choices: [{ message: { role: "assistant", content: "Hello from AI" } }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ Add best-practice mock restore here
  afterEach(() => {
    vi.resetAllMocks(); // Ensures mock history/state is wiped clean
  });

  it("renders the input field and send button", () => {
    render(<ChatPanel />);
    expect(
      screen.getByPlaceholderText("Ask the agent something...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("sends a message and displays the response", async () => {
    (sendChatMessage as Mock).mockResolvedValueOnce(mockResponse);

    render(<ChatPanel />);
    const input = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Hello from AI")).toBeInTheDocument();
    });

    expect((input as HTMLInputElement).value).toBe("");
  });

  it("displays an error message when the API call fails", async () => {
    (sendChatMessage as Mock).mockRejectedValueOnce(new Error("API Error"));

    render(<ChatPanel />);
    const input = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
