// /frontend/src/components/ui/__tests__/status-badge.test.tsx

/// <reference types="vitest" />
import { render, screen } from "@testing-library/react";
import StatusBadge from "../components/ui/status-badge";

describe("StatusBadge", () => {
  it("renders a success badge", () => {
    render(<StatusBadge status="success" />);
    const badge = screen.getByText("success");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge.className).toMatch(/bg-green/i); // or whatever `badgeVariants("success")` resolves to
  });

  it("renders an error badge", () => {
    render(<StatusBadge status="error" />);
    const badge = screen.getByText("error");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toMatch(/bg-red|destructive/i);
  });

  it("renders an outline badge for unknown status", () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText("pending");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toMatch(/outline/i);
  });
});
