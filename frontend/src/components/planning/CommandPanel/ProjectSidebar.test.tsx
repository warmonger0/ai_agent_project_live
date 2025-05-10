import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProjectSidebar from "./ProjectSidebar";

// 👇 Ensure fetch is mocked globally to intercept internal useProjects() calls
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 1,
            title: "Project Alpha",
            chats: [
              { id: "chat-1", title: "Alpha Chat 1" },
              { id: "chat-2", title: "Alpha Chat 2" },
            ],
          },
          {
            id: 2,
            title: "Project Beta",
            chats: [{ id: "chat-3", title: "Beta Chat 1" }],
          },
        ]),
    })
  ) as unknown as typeof fetch;
});

describe("ProjectSidebar", () => {
  it("renders chats after selecting a project", async () => {
    render(<ProjectSidebar selectedChatId={null} onSelectChat={() => {}} />);

    // Select "Project Alpha"
    const select = screen.getByLabelText(/select project/i);
    fireEvent.change(select, { target: { value: "1" } });

    // Chats should now be visible
    expect(await screen.findByText("Alpha Chat 1")).toBeInTheDocument();
    expect(screen.getByText("Alpha Chat 2")).toBeInTheDocument();
  });

  it("calls onSelectChat when a chat is clicked", async () => {
    const onSelectChat = vi.fn();

    render(
      <ProjectSidebar selectedChatId={null} onSelectChat={onSelectChat} />
    );

    // Select "Project Alpha" first
    const select = screen.getByLabelText(/select project/i);
    fireEvent.change(select, { target: { value: "1" } });

    // Click on "Alpha Chat 2"
    const chatItem = await screen.findByText("Alpha Chat 2");
    fireEvent.click(chatItem);

    expect(onSelectChat).toHaveBeenCalledWith("chat-2");
  });
});
