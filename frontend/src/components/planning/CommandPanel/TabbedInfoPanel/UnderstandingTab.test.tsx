import { render, screen } from "@testing-library/react";
import UnderstandingTab from "./UnderstandingTab";

describe("UnderstandingTab", () => {
  it("renders understanding placeholder", () => {
    render(<UnderstandingTab projectId={123} />); // ✅ add required prop
    expect(screen.getByText(/Project understanding/i)).toBeInTheDocument();
  });
});
