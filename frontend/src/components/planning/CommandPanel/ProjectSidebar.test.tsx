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
  it("renders projects and chats upon selection", () => {
    render(
      <ProjectSidebar
        selectedChatId={null}
        onSelectChat={() => {}}
        onSelectProject={() => {}}
      />
    );

    // Select 'Project Alpha' from the dropdown
    const selectElement = screen.getByLabelText("Select Project");
    fireEvent.change(selectElement, { target: { value: "1" } });

    // Verify that chats for 'Project Alpha' are displayed
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

    // Select 'Project Alpha' to display its chats
    const selectElement = screen.getByLabelText("Select Project");
    fireEvent.change(selectElement, { target: { value: "1" } });

    // Click on 'Alpha Chat 2'
    const chatItem = screen.getByText("Alpha Chat 2");
    fireEvent.click(chatItem);

    // Verify that onSelectChat is called with 'chat-2'
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

    // Select 'Project Beta' from the dropdown
    const selectElement = screen.getByLabelText("Select Project");
    fireEvent.change(selectElement, { target: { value: "2" } });

    // Verify that onSelectProject is called with 2
    expect(onSelectProject).toHaveBeenCalledWith(2);
  });
});
