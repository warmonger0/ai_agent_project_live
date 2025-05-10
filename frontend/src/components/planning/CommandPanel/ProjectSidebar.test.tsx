// File: src/components/planning/CommandPanel/ProjectSidebar.test.tsx

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
  it("renders projects in the select dropdown", () => {
    render(
      <ProjectSidebar
        selectedChatId={null}
        onSelectChat={() => {}}
        onSelectProject={() => {}}
      />
    );

    // Check for the presence of project options in the select dropdown
    expect(
      screen.getByRole("option", { name: "Project Alpha" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Project Beta" })
    ).toBeInTheDocument();
  });

  it("renders chats after selecting a project", () => {
    render(
      <ProjectSidebar
        selectedChatId={null}
        onSelectChat={() => {}}
        onSelectProject={() => {}}
      />
    );

    // Simulate selecting "Project Alpha" from the dropdown
    fireEvent.change(screen.getByLabelText("Select Project"), {
      target: { value: "1" },
    });

    // Check for the presence of chats associated with "Project Alpha"
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

    // Simulate selecting "Project Alpha" from the dropdown
    fireEvent.change(screen.getByLabelText("Select Project"), {
      target: { value: "1" },
    });

    // Simulate clicking on "Alpha Chat 2"
    fireEvent.click(screen.getByText("Alpha Chat 2"));

    // Expect the onSelectChat handler to be called with the correct chat ID
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

    // Simulate selecting "Project Beta" from the dropdown
    fireEvent.change(screen.getByLabelText("Select Project"), {
      target: { value: "2" },
    });

    // Expect the onSelectProject handler to be called with the correct project ID
    expect(onSelectProject).toHaveBeenCalledWith(2);
  });
});
