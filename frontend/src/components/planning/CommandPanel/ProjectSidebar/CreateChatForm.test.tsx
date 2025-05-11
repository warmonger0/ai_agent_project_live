// File: CreateChatForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CreateChatForm from "./CreateChatForm";

describe("CreateChatForm", () => {
  it("calls onCreate with entered chat title", () => {
    const onCreate = vi.fn();
    render(<CreateChatForm onCreate={onCreate} />);

    const input = screen.getByPlaceholderText(/New chat name/i);
    const button = screen.getByRole("button", { name: "+" });

    fireEvent.change(input, { target: { value: "My New Chat" } });
    fireEvent.click(button);

    expect(onCreate).toHaveBeenCalledWith("My New Chat");
  });

  it("clears input after create", () => {
    const onCreate = vi.fn();
    render(<CreateChatForm onCreate={onCreate} />);

    const input = screen.getByPlaceholderText(/New chat name/i);
    const button = screen.getByRole("button", { name: "+" });

    fireEvent.change(input, { target: { value: "Chat to Clear" } });
    fireEvent.click(button);

    expect(input).toHaveValue("");
  });
});
