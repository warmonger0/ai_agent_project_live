// File: /frontend/src/components/planning/CommandPanel/ProjectSidebar.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectSidebar from "./ProjectSidebar";

// Mock data for projects and chats
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

// Mock the useProjects hook
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

    // Verify the project select dropdown is present
    const projectSelect = screen.getByLabelText("Select Project");
    expect(projectSelect).toBeInTheDocument();

    // Select "Project Alpha"
    fireEvent.change(projectSelect, { target: { value: "1" } });

    // Verify chats for "Project Alpha" are displayed
    expect(screen.getByText("Alpha Chat 1")).toBeInTheDocument();
    expect(screen.getByText("Alpha Chat 2")).toBeInTheDocument();
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

    // Select "Project Alpha"
    const projectSelect = screen.getByLabelText("Select Project");
    fireEvent.change(projectSelect, { target: { value: "1" } });

    // Click on "Alpha Chat 2"
    const chatItem = screen.getByText("Alpha Chat 2");
    fireEvent.click(chatItem);

    // Verify onSelectChat is called with correct chat ID
    expect(onSelectChat).toHaveBeenCalledWith("chat-2");
  });

  it("calls onSelectProject when a project is selected", () => {
    const onSelectProject = vi.fn();

    render(
      <ProjectSidebar
        selectedChatId={null}
        onSelectChat={() => {}}
        onSelectProject={onSelectProject}
      />
    );

    // Select "Project Beta"
    const projectSelect = screen.getByLabelText("Select Project");
    fireEvent.change(projectSelect, { target: { value: "2" } });

    // Verify onSelectProject is called with correct project ID
    expect(onSelectProject).toHaveBeenCalledWith(2);
  });
});
