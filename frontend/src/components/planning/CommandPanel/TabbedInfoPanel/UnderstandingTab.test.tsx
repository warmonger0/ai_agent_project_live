// File: UnderstandingTab.test.tsx

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import UnderstandingTab from "./UnderstandingTab";

// ✅ Mock Axios methods to prevent real HTTP calls
vi.mock("axios", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { understanding: {} } }),
    put: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe("UnderstandingTab", () => {
  it("renders understanding placeholder", () => {
    render(<UnderstandingTab projectId={123} />);
    expect(screen.getByText(/Project understanding/i)).toBeInTheDocument();
  });
});
