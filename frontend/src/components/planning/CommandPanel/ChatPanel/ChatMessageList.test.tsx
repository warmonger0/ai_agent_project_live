// File: /frontend/src/__tests__/commandPanel/ChatMessageList.test.tsx

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ChatMessageList from "@/components/planning/CommandPanel/ChatPanel/ChatMessageList";
import type { ChatMessage } from "./types"; // ✅ fixed import

describe("ChatMessageList", () => {
  const messages: ChatMessage[] = [
    { role: "user", content: "Hello from user" },
    { role: "assistant", content: "Hello from assistant" },
  ];

  it("renders all messages in the list", () => {
    render(<ChatMessageList messages={messages} loading={false} />); // ✅ add `loading`

    expect(screen.getByText("Hello from user")).toBeInTheDocument();
    expect(screen.getByText("Hello from assistant")).toBeInTheDocument();
  });

  it("renders an empty state when there are no messages", () => {
    render(<ChatMessageList messages={[]} loading={false} />); // ✅ add `loading`
    expect(screen.queryByText(/hello/i)).not.toBeInTheDocument();
  });
});
