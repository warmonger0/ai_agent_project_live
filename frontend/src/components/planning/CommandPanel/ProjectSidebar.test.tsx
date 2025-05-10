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
  it("renders chat list when a project is selected", () => {
    render(<ProjectSidebar selectedChatId={null} onSelectChat={() => {}} />);

    // Simulate selecting "Project Alpha"
    fireEvent.change(screen.getByLabelText(/select project/i), {
      target: { value: "1" },
    });

    expect(screen.getByText("Alpha Chat 1")).toBeInTheDocument();
    expect(screen.getByText("Alpha Chat 2")).toBeInTheDocument();
  });

  it("calls onSelectChat when a chat is clicked", () => {
    const onSelectChat = vi.fn();

    render(
      <ProjectSidebar selectedChatId={null} onSelectChat={onSelectChat} />
    );

    fireEvent.change(screen.getByLabelText(/select project/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText("Alpha Chat 2"));
    expect(onSelectChat).toHaveBeenCalledWith("chat-2");
  });
});
