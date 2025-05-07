// File: /frontend/src/__tests__/ChatPanel.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import ChatPanel from "../components/planning/ChatPanel";
import { sendChatMessage } from "../lib/sendChatMessage";

// Mock the sendChatMessage function
vi.mock("../lib/sendChatMessage");

describe("ChatPanel Component", () => {
  const mockResponse = {
    choices: [{ message: { role: "assistant", content: "Hello from AI" } }],
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it("renders the input field and send button", () => {
    render(<ChatPanel />);
    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("sends a message and displays the response", async () => {
    // Mock the API response
    (sendChatMessage as vi.Mock).mockResolvedValueOnce(mockResponse);

    render(<ChatPanel />);

    const input = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    // Simulate user typing a message
    fireEvent.change(input, { target: { value: "Hello" } });

    // Simulate clicking the send button
    fireEvent.click(sendButton);

    // Wait for the assistant's response to appear
    await waitFor(() => {
      expect(screen.getByText("Hello from AI")).toBeInTheDocument();
    });

    // Ensure the input field is cleared after sending
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("displays an error message when the API call fails", async () => {
    // Mock the API to throw an error
    (sendChatMessage as vi.Mock).mockRejectedValueOnce(new Error("API Error"));

    render(<ChatPanel />);

    const input = screen.getByPlaceholderText("Type your message...");
    const sendButton = screen.getByRole("button", { name: /send/i });

    // Simulate user typing a message
    fireEvent.change(input, { target: { value: "Hello" } });

    // Simulate clicking the send button
    fireEvent.click(sendButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
