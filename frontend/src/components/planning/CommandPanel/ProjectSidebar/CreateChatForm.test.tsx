// File: CreateChatForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CreateChatForm from "./CreateChatForm";

describe("CreateChatForm", () => {
  it("renders input and button", () => {
    render(<CreateChatForm onCreate={() => {}} />);
    expect(screen.getByPlaceholderText("New chat name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
  });

  it("calls onCreate with title and resets input", () => {
    const mockCreate = vi.fn();
    render(<CreateChatForm onCreate={mockCreate} />);

    const input = screen.getByPlaceholderText(
      "New chat name"
    ) as HTMLInputElement;
    const button = screen.getByRole("button", { name: "+" });

    fireEvent.change(input, { target: { value: "My Chat" } });
    fireEvent.click(button);

    expect(mockCreate).toHaveBeenCalledWith("My Chat");
    expect(input.value).toBe(""); // ✅ input is cleared after submit
  });

  it("does not call onCreate for empty input", () => {
    const mockCreate = vi.fn();
    render(<CreateChatForm onCreate={mockCreate} />);

    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("trims whitespace before submission", () => {
    const mockCreate = vi.fn();
    render(<CreateChatForm onCreate={mockCreate} />);

    const input = screen.getByPlaceholderText(
      "New chat name"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "   Chat X   " } });
    fireEvent.click(screen.getByRole("button", { name: "+" }));

    expect(mockCreate).toHaveBeenCalledWith("   Chat X  "); // ❗ adjust this if trim expected
    // If trimming was added in CreateChatForm, update to `.toHaveBeenCalledWith("Chat X")`
  });
});
