import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProjectSidebar from "./ProjectSidebar";

// 🔧 Intercept internal fetch calls from useEffect in the component
beforeEach(() => {
  global.fetch = vi.fn((input: RequestInfo) => {
    const url = input.toString();

    if (url === "/api/v1/chat/projects") {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "Project Alpha" },
            { id: 2, name: "Project Beta" },
          ]),
      }) as unknown as Response;
    }

    if (url === "/api/v1/chat/projects/1/chats") {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 101, title: "Alpha Chat 1" },
            { id: 102, title: "Alpha Chat 2" },
          ]),
      }) as unknown as Response;
    }

    if (url === "/api/v1/chat/projects/2/chats") {
      return Promise.resolve({
        json: () => Promise.resolve([{ id: 201, title: "Beta Chat 1" }]),
      }) as unknown as Response;
    }

    return Promise.reject(new Error("Unhandled fetch URL: " + url));
  }) as unknown as typeof fetch;
});

describe("ProjectSidebar", () => {
  it("renders chats after selecting a project", async () => {
    render(<ProjectSidebar selectedChatId={null} onSelectChat={() => {}} />);

    const select = screen.getByLabelText(/select project/i);
    fireEvent.change(select, { target: { value: "1" } });

    // Wait for both chat items to appear
    await waitFor(() => {
      expect(screen.getByText("Alpha Chat 1")).toBeInTheDocument();
      expect(screen.getByText("Alpha Chat 2")).toBeInTheDocument();
    });
  });

  it("calls onSelectChat when a chat is clicked", async () => {
    const onSelectChat = vi.fn();

    render(
      <ProjectSidebar selectedChatId={null} onSelectChat={onSelectChat} />
    );

    const select = screen.getByLabelText(/select project/i);
    fireEvent.change(select, { target: { value: "1" } });

    const chatItem = await screen.findByText("Alpha Chat 2");
    fireEvent.click(chatItem);

    expect(onSelectChat).toHaveBeenCalledWith(102);
  });
});
