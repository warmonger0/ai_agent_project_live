import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChatInput from "./ChatInput";

describe("ChatInput", () => {
  it("renders input and button", () => {
    const mockChange = vi.fn();
    const mockSend = vi.fn();

    render(
      <ChatInput
        value="Hello"
        onChange={mockChange}
        onSend={mockSend}
        disabled={false}
      />
    );

    expect(screen.getByPlaceholderText(/ask the agent/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const mockChange = vi.fn();
    const mockSend = vi.fn();

    render(
      <ChatInput
        value=""
        onChange={mockChange}
        onSend={mockSend}
        disabled={false}
      />
    );

    const input = screen.getByPlaceholderText(/ask the agent/i);
    fireEvent.change(input, { target: { value: "Hello!" } });
    expect(mockChange).toHaveBeenCalledWith("Hello!");
  });

  it("calls onSend when button is clicked", () => {
    const mockChange = vi.fn();
    const mockSend = vi.fn();

    render(
      <ChatInput
        value="Test"
        onChange={mockChange}
        onSend={mockSend}
        disabled={false}
      />
    );

    const button = screen.getByRole("button", { name: /send/i });
    fireEvent.click(button);
    expect(mockSend).toHaveBeenCalled();
  });
});
