import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ChatPanel from "./ChatPanel";

// Mock usePersistentChat
const mockHandleSend = vi.fn();
const mockClearMessages = vi.fn();
const mockSetInput = vi.fn();

vi.mock("@/hooks/usePersistentChat", () => ({
  default: () => ({
    messages: [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there!" },
    ],
    input: "Hello",
    setInput: mockSetInput,
    loading: false,
    error: null,
    handleSend: mockHandleSend,
    clearMessages: mockClearMessages,
  }),
}));

// Mock children
vi.mock("./ChatPanel/ChatMessageList", () => ({
  default: ({ messages }: { messages: any[] }) => (
    <ul data-testid="chat-list">
      {messages.map((msg, i) => (
        <li key={i}>{msg.content}</li>
      ))}
    </ul>
  ),
}));

vi.mock("./ChatPanel/ChatInput", () => ({
  default: ({ value, onChange, onSend }: any) => (
    <div>
      <input
        data-testid="chat-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button onClick={onSend}>Send</button>
    </div>
  ),
}));

describe("ChatPanel", () => {
  it("renders messages and input", () => {
    render(<ChatPanel chatId="abc123" />);
    expect(screen.getByTestId("chat-list")).toBeInTheDocument();
    expect(screen.getByTestId("chat-input")).toHaveValue("Hello");
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });

  it("sends a message when Send button is clicked", () => {
    render(<ChatPanel chatId="abc123" />);
    fireEvent.click(screen.getByText("Send"));
    expect(mockHandleSend).toHaveBeenCalled();
  });

  it("clears messages when Clear is clicked", () => {
    render(<ChatPanel chatId="abc123" />);
    fireEvent.click(screen.getByText("Clear"));
    expect(mockClearMessages).toHaveBeenCalled();
  });
});
