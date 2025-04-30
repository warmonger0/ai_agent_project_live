/// <reference types="vitest" />
import { vi } from "vitest";

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import SystemHealth from "../pages/SystemHealth";

// ✅ Use Vitest mocking syntax
vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

describe("SystemHealth", () => {
  beforeEach(() => {
    mockedAxios.get = vi.fn(); // ✅ reset manually each time
  });

  it("displays loading then health status", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { backend: "OK", model: "OK" },
    });

    render(<SystemHealth />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(
          (_, el) => el?.textContent?.toLowerCase() === "backend: ok"
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          (_, el) => el?.textContent?.toLowerCase() === "model: ok"
        )
      ).toBeInTheDocument();
    });
  });

  it("displays error message on fetch failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    render(<SystemHealth />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });
  });

  it("triggers manual refresh", async () => {
    // First call: OK
    mockedAxios.get.mockResolvedValueOnce({
      data: { backend: "OK", model: "OK" },
    });

    render(<SystemHealth />);

    await waitFor(() =>
      expect(
        screen.getByText(
          (_, el) => el?.textContent?.toLowerCase() === "model: ok"
        )
      ).toBeInTheDocument()
    );

    // Second call: FAIL
    mockedAxios.get.mockResolvedValueOnce({
      data: { backend: "OK", model: "FAIL" },
    });

    fireEvent.click(screen.getByText(/refresh/i));

    await waitFor(() =>
      expect(
        screen.getByText(
          (_, el) => el?.textContent?.toLowerCase() === "model: fail"
        )
      ).toBeInTheDocument()
    );
  });
});
