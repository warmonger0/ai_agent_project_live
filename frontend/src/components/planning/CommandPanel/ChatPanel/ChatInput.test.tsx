// File: ChatInput.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChatInput from "./ChatPanel/ChatInput";

describe("ChatInput", () => {
  it("renders input and button", () => {
    const mockChange = vi.fn();
    const mockSubmit = vi.fn();

    render(
      <ChatInput
        input="Hello"
        onChange={mockChange}
        onSubmit={mockSubmit}
        disabled={false}
      />
    );

    expect(screen.getByPlaceholderText(/ask the agent/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("calls onChange when input is typed in", () => {
    const mockChange = vi.fn();

    render(
      <ChatInput
        input=""
        onChange={mockChange}
        onSubmit={() => {}}
        disabled={false}
      />
    );

    const input = screen.getByPlaceholderText(/ask the agent/i);
    fireEvent.change(input, { target: { value: "Test" } });

    expect(mockChange).toHaveBeenCalledWith("Test");
  });

  it("calls onSubmit when send button is clicked", () => {
    const mockSubmit = vi.fn();

    render(
      <ChatInput
        input="Hello"
        onChange={() => {}}
        onSubmit={mockSubmit}
        disabled={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(mockSubmit).toHaveBeenCalled();
  });

  it("calls onSubmit when Enter key is pressed", () => {
    const mockSubmit = vi.fn();

    render(
      <ChatInput
        input="Do it"
        onChange={() => {}}
        onSubmit={mockSubmit}
        disabled={false}
      />
    );

    const input = screen.getByPlaceholderText(/ask the agent/i);
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(mockSubmit).toHaveBeenCalled();
  });

  it("does not allow interaction when disabled", () => {
    const mockSubmit = vi.fn();
    const mockChange = vi.fn();

    render(
      <ChatInput
        input="Disabled"
        onChange={mockChange}
        onSubmit={mockSubmit}
        disabled={true}
      />
    );

    const input = screen.getByPlaceholderText(/ask the agent/i);
    const button = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "should not fire" } });
    fireEvent.click(button);
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockChange).not.toHaveBeenCalled();
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
