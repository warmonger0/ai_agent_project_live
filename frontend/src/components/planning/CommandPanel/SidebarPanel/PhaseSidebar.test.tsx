import { render, screen } from "@testing-library/react";
import PhaseSidebar from "./PhaseSidebar";

describe("PhaseSidebar", () => {
  it("renders all four phases with correct labels", () => {
    render(<PhaseSidebar />);

    expect(screen.getByText("Phase 1: Command Panel")).toBeInTheDocument();
    expect(screen.getByText("Phase 2: Agent Delegation")).toBeInTheDocument();
    expect(screen.getByText("Phase 3: Dependency Setup")).toBeInTheDocument();
    expect(screen.getByText("Phase 4: Implementation")).toBeInTheDocument();
  });
});
