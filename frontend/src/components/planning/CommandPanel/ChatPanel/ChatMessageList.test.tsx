// File: ChatMessageList.test.tsx

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ChatMessageList from "./ChatMessageList"; // ✅ local file
import type { ChatMessage } from "@/components/planning/CommandPanel/ChatPanel/types"; // ✅ fix path

describe("ChatMessageList", () => {
  const messages: ChatMessage[] = [
    { role: "user", content: "Hello from user" },
    { role: "assistant", content: "Hello from assistant" },
  ];

  it("renders all messages in the list", () => {
    render(<ChatMessageList messages={messages} loading={false} />);

    expect(screen.getByText("Hello from user")).toBeInTheDocument();
    expect(screen.getByText("Hello from assistant")).toBeInTheDocument();
  });

  it("renders an empty state when there are no messages", () => {
    render(<ChatMessageList messages={[]} loading={false} />);
    expect(screen.queryByText(/hello/i)).not.toBeInTheDocument();
  });
});
