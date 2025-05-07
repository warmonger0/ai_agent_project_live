// File: /frontend/src/__tests__/commandPanel/ChatMessage.test.tsx

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ChatMessage from "@/components/planning/ChatPanel/ChatMessage";

describe("ChatMessage", () => {
  it("renders a user message with correct content", () => {
    render(
      <ChatMessage message={{ role: "user", content: "Hello from user" }} />
    );

    const message = screen.getByText("Hello from user");
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass("text-right"); // assuming your styles differentiate user/assistant
  });

  it("renders an assistant message with correct content", () => {
    render(
      <ChatMessage message={{ role: "assistant", content: "Hello from AI" }} />
    );

    const message = screen.getByText("Hello from AI");
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass("text-left"); // same assumption on CSS
  });
});
