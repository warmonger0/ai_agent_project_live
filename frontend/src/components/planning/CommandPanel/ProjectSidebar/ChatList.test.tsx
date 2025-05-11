// File: ChatList.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ChatList from "./ChatList";

const chats = [
  { id: 1, title: "Chat One" },
  { id: 2, title: "Chat Two" },
];

describe("ChatList", () => {
  it("renders list of chats", () => {
    render(
      <ChatList chats={chats} selectedChatId={1} onSelectChat={() => {}} />
    );
    expect(screen.getByText("Chat One")).toBeInTheDocument();
    expect(screen.getByText("Chat Two")).toBeInTheDocument();
  });

  it("calls onSelectChat when a chat is clicked", () => {
    const onSelect = vi.fn();
    render(
      <ChatList chats={chats} selectedChatId={2} onSelectChat={onSelect} />
    );

    fireEvent.click(screen.getByText("Chat One"));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("highlights selected chat", () => {
    render(
      <ChatList chats={chats} selectedChatId={2} onSelectChat={() => {}} />
    );
    const selected = screen.getByText("Chat Two");
    expect(selected.className).toMatch(/bg-blue-200/);
  });
});
