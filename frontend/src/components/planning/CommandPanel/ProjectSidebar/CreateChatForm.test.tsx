import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CreateChatForm from "./CreateChatForm";

describe("CreateChatForm", () => {
  it("renders input and button", () => {
    render(<CreateChatForm projectId={1} onChatCreated={() => {}} />);
    expect(screen.getByPlaceholderText("New chat...")).toBeInTheDocument();
    expect(screen.getByTitle("Create Chat")).toBeInTheDocument();
  });

  it("calls onChatCreated after successful input", async () => {
    const mock = vi.fn();

    // mock fetch response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<CreateChatForm projectId={123} onChatCreated={mock} />);

    fireEvent.change(screen.getByPlaceholderText("New chat..."), {
      target: { value: "Test Chat" },
    });

    fireEvent.click(screen.getByTitle("Create Chat"));

    await screen.findByDisplayValue(""); // wait for input to be cleared
    expect(mock).toHaveBeenCalled();
  });
});
