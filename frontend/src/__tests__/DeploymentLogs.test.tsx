/// <reference types="vitest" />
import { vi } from "vitest";

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import DeploymentLogs from "../../src/pages/DeploymentLogs";

// ✅ Replace Jest with Vitest mocks
vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

describe("DeploymentLogs", () => {
  const mockLogList = ["test.log", "deployment_2025-04-22.log"];
  const mockLogContent = "🚀 Deployment complete\n✅ System check passed";

  beforeEach(() => {
    mockedAxios.get = vi.fn().mockImplementation((url) => {
      if (url === "/logs") {
        return Promise.resolve({ data: mockLogList });
      }
      if (url === "/logs/test.log") {
        return Promise.resolve({ data: mockLogContent });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });
  });

  it("renders logs and shows content when clicked", async () => {
    render(<DeploymentLogs />);

    // Wait for log list
    await waitFor(() => {
      expect(screen.getByText("test.log")).toBeInTheDocument();
    });

    // Click on a log file
    fireEvent.click(screen.getByText("test.log"));

    // Wait for its content to appear
    await waitFor(() =>
      expect(screen.getByText(/Deployment complete/i)).toBeInTheDocument()
    );
  });
});
