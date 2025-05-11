import { render, screen } from "@testing-library/react";
import FileTreeTab from "./FileTreeTab";

describe("FileTreeTab", () => {
  it("renders file tree placeholder", () => {
    render(<FileTreeTab />);
    expect(screen.getByText(/File tree/i)).toBeInTheDocument();
  });
});
