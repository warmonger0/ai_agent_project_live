/// <reference types="vitest" />
import { vi } from "vitest";
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SystemHealth from "../pages/SystemHealth";
import * as apiModule from "@/lib/services/api";

// ✅ Mock both the axios instance and unwrapApiResponse
vi.mock("@/lib/services/api", async () => {
  return {
    default: {
      get: vi.fn(),
    },
    unwrapApiResponse: vi.fn((res) => res.data),
  };
});

describe("SystemHealth", () => {
  const mockedGet = apiModule.default.get as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("displays loading then health status", async () => {
    mockedGet.mockResolvedValueOnce({
      data: { backend: "OK", model: "OK" },
    });

    render(<SystemHealth />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("backend-status")).toHaveTextContent("OK");
      expect(screen.getByTestId("model-status")).toHaveTextContent("OK");
    });
  });

  it("displays error message on fetch failure", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Network error"));

    render(<SystemHealth />);
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });
  });

  it("triggers manual refresh", async () => {
    mockedGet.mockResolvedValueOnce({
      data: { backend: "OK", model: "OK" },
    });

    render(<SystemHealth />);
    await waitFor(() =>
      expect(screen.getByTestId("model-status")).toHaveTextContent("OK")
    );

    mockedGet.mockResolvedValueOnce({
      data: { backend: "OK", model: "FAIL" },
    });

    fireEvent.click(screen.getByText(/refresh/i));

    await waitFor(() =>
      expect(screen.getByTestId("model-status")).toHaveTextContent("FAIL")
    );
  });
});
