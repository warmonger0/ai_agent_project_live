import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectSidebar from "./ProjectSidebar";

const mockProjects = [
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
];

vi.mock("@/hooks/useProjects", () => ({
  default: () => ({
    projects: mockProjects,
    isLoading: false,
    error: null,
  }),
}));

describe("ProjectSidebar", () => {
  it("renders list of projects and chats", () => {
    render(
      <ProjectSidebar
        selectedChatId={null}
        onSelectChat={() => {}}
        onSelectProject={() => {}}
      />
    );

    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Alpha Chat 1")).toBeInTheDocument();
    expect(screen.getByText("Beta Chat 1")).toBeInTheDocument();
  });

  it("calls onSelectChat when a chat is clicked", () => {
    const onSelectChat = vi.fn();

    render(
      <ProjectSidebar
        selectedChatId={null}
        onSelectChat={onSelectChat}
        onSelectProject={() => {}}
      />
    );

    fireEvent.click(screen.getByText("Alpha Chat 2"));
    expect(onSelectChat).toHaveBeenCalledWith("chat-2");
  });

  it("calls onSelectProject when a project is clicked", () => {
    const onSelectProject = vi.fn();

    render(
      <ProjectSidebar
        selectedChatId={null}
        onSelectChat={() => {}}
        onSelectProject={onSelectProject}
      />
    );

    fireEvent.click(screen.getByText("Project Beta"));
    expect(onSelectProject).toHaveBeenCalledWith(2);
  });
});
