import { render, screen } from "@testing-library/react";
import IssuesTab from "./IssuesTab";

describe("IssuesTab", () => {
  it("renders issues placeholder", () => {
    render(<IssuesTab />);
    expect(screen.getByText(/Issues/i)).toBeInTheDocument();
  });
});
