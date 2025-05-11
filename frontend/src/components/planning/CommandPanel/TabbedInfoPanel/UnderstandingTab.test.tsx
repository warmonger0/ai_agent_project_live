// File: UnderstandingTab.test.tsx

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import UnderstandingTab from "./UnderstandingTab";

// ✅ Mock Axios and suppress actual network request
vi.mock("axios");
(axios.put as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
  data: {},
});

describe("UnderstandingTab", () => {
  it("renders understanding placeholder", () => {
    render(<UnderstandingTab projectId={123} />); // ✅ required prop
    expect(screen.getByText(/Project understanding/i)).toBeInTheDocument();
  });
});
