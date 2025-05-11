import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProjectSidebar from "./ProjectSidebar";

beforeEach(() => {
  global.fetch = vi.fn((input: RequestInfo) => {
    const url = input.toString();
    console.log("[Mock fetch called]:", url); // For debugging

    if (url === "/api/v1/chat/projects") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 1, name: "Project Alpha" },
            { id: 2, name: "Project Beta" },
          ]),
      }) as unknown as Response;
    }

    if (url === "/api/v1/chat/projects/1/chats") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 101, title: "Alpha Chat 1" },
            { id: 102, title: "Alpha Chat 2" },
          ]),
      }) as unknown as Response;
    }

    if (url === "/api/v1/chat/projects/2/chats") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 201, title: "Beta Chat 1" }]),
      }) as unknown as Response;
    }

    throw new Error("❌ Unhandled fetch URL: " + url);
  }) as unknown as typeof fetch;
});

describe("ProjectSidebar", () => {
  it("renders chats after selecting a project", async () => {
    render(
      <ProjectSidebar
        selectedChatId={null}
        onSelectChat={() => {}}
        onSelectProject={() => {}}
      />
    );

    const select = await screen.findByLabelText(/select project/i);
    fireEvent.change(select, { target: { value: "1" } }); // ensure it's a string that parses to 1

    const chats = await screen.findAllByRole("button", { name: /Alpha Chat/i });
    expect(chats.map((el) => el.textContent)).toEqual([
      "Alpha Chat 1",
      "Alpha Chat 2",
    ]);
  });

  it("calls onSelectChat when a chat is clicked", async () => {
    const onSelectChat = vi.fn();

    render(
      <ProjectSidebar
        selectedChatId={null}
        onSelectChat={onSelectChat}
        onSelectProject={() => {}}
      />
    );

    const select = await screen.findByLabelText(/select project/i);
    fireEvent.change(select, { target: { value: "1" } });

    const chatButton = await screen.findByRole("button", {
      name: "Alpha Chat 2",
    });
    fireEvent.click(chatButton);

    expect(onSelectChat).toHaveBeenCalledWith(102);
  });
});
