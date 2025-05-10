import { render, screen } from "@testing-library/react";
import PhaseSidebar from "./PhaseSidebar";

describe("PhaseSidebar", () => {
  it("renders all four phases with correct labels", () => {
    render(<PhaseSidebar />);

    expect(screen.getByText("Phase 1: Planning")).toBeInTheDocument();
    expect(screen.getByText("Phase 2: Scaffolding")).toBeInTheDocument();
    expect(screen.getByText("Phase 3: Implementation")).toBeInTheDocument();
    expect(screen.getByText("Phase 4: Review & Iteration")).toBeInTheDocument();
  });
});
