/// <reference types="vitest" />
import { vi } from "vitest";
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import DeploymentLogs from "../../src/pages/DeploymentLogs";

// ✅ Mock axios
vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

describe("DeploymentLogs", () => {
  const mockLogList = ["test.log", "deployment_2025-04-22.log"];
  const mockLogContent = "🚀 Deployment complete\n✅ System check passed";

  beforeEach(() => {
    mockedAxios.get = vi.fn().mockImplementation((url) => {
      if (url === "/api/v1/logs" || url === "/api/v1/logs/") {
        return Promise.resolve({ data: { ok: true, data: mockLogList } });
      }
      if (url === "/api/v1/logs/test.log") {
        // ✅ Return plain text, since the component expects a string
        return Promise.resolve({ data: mockLogContent });
      }
      return Promise.reject(new Error("Unexpected URL: " + url));
    });
  });

  it("renders logs and shows content when clicked", async () => {
    render(<DeploymentLogs />);

    // Confirm log list renders
    await waitFor(() => {
      expect(screen.getByText("test.log")).toBeInTheDocument();
    });

    // Trigger loading of the log content
    fireEvent.click(screen.getByText("test.log"));

    // Confirm log content loads
    await waitFor(() =>
      expect(screen.getByText(/Deployment complete/i)).toBeInTheDocument()
    );
  });
});
