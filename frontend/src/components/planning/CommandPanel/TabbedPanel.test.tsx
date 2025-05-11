// File: /src/components/planning/CommandPanel/TabbedInfoPanel/TabbedPanel.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
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
    expect(screen.getByText(/understanding/i)).toBeInTheDocument(); // placeholder or content keyword
  });

  it("renders File Tree content after clicking tab", () => {
    render(<TabbedPanel />);
    fireEvent.click(screen.getByText("File Tree"));
    expect(screen.getByText(/file tree/i)).toBeInTheDocument();
  });

  it("renders Issues content after clicking tab", () => {
    render(<TabbedPanel />);
    fireEvent.click(screen.getByText("Issues"));
    expect(screen.getByText(/issues/i)).toBeInTheDocument();
  });

  it("does not render multiple tab contents at once", () => {
    render(<TabbedPanel />);
    fireEvent.click(screen.getByText("File Tree"));
    expect(screen.queryByText(/understanding/i)).not.toBeVisible();
    fireEvent.click(screen.getByText("Issues"));
    expect(screen.queryByText(/file tree/i)).not.toBeVisible();
  });
});
