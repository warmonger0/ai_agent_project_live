import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TabbedPanel from "./TabbedPanel";

describe("TabbedPanel", () => {
  it("renders all tab buttons", () => {
    render(<TabbedPanel />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((btn) => btn.textContent)).toEqual(
      expect.arrayContaining(["Understanding", "File Tree", "Issues"])
    );
  });

  it("shows Understanding tab content by default", () => {
    render(<TabbedPanel />);
    const heading = screen.getByRole("heading", {
      name: /project understanding/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders File Tree content after clicking tab", () => {
    render(<TabbedPanel />);
    const fileTreeTab = screen.getByRole("button", { name: /file tree/i });
    fireEvent.click(fileTreeTab);
    expect(screen.getByText(/file tree content/i)).toBeInTheDocument();
  });

  it("renders Issues content after clicking tab", () => {
    render(<TabbedPanel />);
    const issuesTab = screen.getByRole("button", { name: /issues/i });
    fireEvent.click(issuesTab);
    expect(screen.getByText(/issues content/i)).toBeInTheDocument();
  });

  it("does not render multiple tab contents at once", () => {
    render(<TabbedPanel />);
    fireEvent.click(screen.getByRole("button", { name: /file tree/i }));
    expect(
      screen.queryByRole("heading", { name: /project understanding/i })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /issues/i }));
    expect(screen.queryByText(/file tree content/i)).not.toBeInTheDocument();
  });
});
