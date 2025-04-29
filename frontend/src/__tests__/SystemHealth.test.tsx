import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom";
import SystemHealth from "../pages/SystemHealth";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("SystemHealth", () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
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
          (content, element) =>
            element?.textContent?.toLowerCase() === "backend: ok",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          (content, element) =>
            element?.textContent?.toLowerCase() === "model: ok",
        ),
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
    // First call returns OK
    mockedAxios.get.mockResolvedValueOnce({
      data: { backend: "OK", model: "OK" },
    });

    render(<SystemHealth />);

    // Wait for initial health
    await waitFor(() =>
      expect(
        screen.getByText(
          (_, element) => element?.textContent?.toLowerCase() === "model: ok",
        ),
      ).toBeInTheDocument(),
    );

    // Second call returns FAIL
    mockedAxios.get.mockResolvedValueOnce({
      data: { backend: "OK", model: "FAIL" },
    });

    // Trigger refresh
    fireEvent.click(screen.getByText(/refresh/i));

    // Wait for refreshed health
    await waitFor(() =>
      expect(
        screen.getByText(
          (_, element) => element?.textContent?.toLowerCase() === "model: fail",
        ),
      ).toBeInTheDocument(),
    );
  });
});
