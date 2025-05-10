import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChatInput from "./ChatInput"; // Ensure this path is correct

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
    const mockSubmit = vi.fn();

    render(
      <ChatInput
        input=""
        onChange={mockChange}
        onSubmit={mockSubmit}
        disabled={false}
      />
    );

    const inputField = screen.getByPlaceholderText(/ask the agent/i);
    fireEvent.change(inputField, { target: { value: "test" } });
    expect(mockChange).toHaveBeenCalled();
  });

  it("calls onSubmit when send button is clicked", () => {
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

    const button = screen.getByRole("button", { name: /send/i });
    fireEvent.click(button);
    expect(mockSubmit).toHaveBeenCalled();
  });
});
