/// <reference types="vitest" />
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

// Declare the mock function reference
let mockFetchHistory: ReturnType<typeof vi.fn>;

// Mock pluginService before component import
vi.mock("@/lib/services/pluginService", () => {
  return {
    fetchPluginHistory: (...args: any[]) => mockFetchHistory(...args),
  };
});

import PluginHistory from "@/components/PluginHistory";

describe("<PluginHistory />", () => {
  let clipboardSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetAllMocks();

    mockFetchHistory = vi.fn().mockResolvedValue([
      {
        id: 1,
        plugin_name: "test_plugin",
        input_data: { text: "hi" },
        output_data: { result: "Echo: hi" },
        status: "success",
        timestamp: new Date().toISOString(),
      },
    ]);

    clipboardSpy = vi.fn().mockResolvedValue(undefined);

    // 👇 Set up clipboard + secure context for test environment
    Object.defineProperty(global.navigator, "clipboard", {
      value: { writeText: clipboardSpy },
      configurable: true,
    });
    Object.defineProperty(global.window, "isSecureContext", {
      value: true,
      configurable: true,
    });
  });

  it("renders plugin execution history", async () => {
    render(<PluginHistory />);
    expect(await screen.findByText(/test_plugin/i)).toBeInTheDocument();
    expect(screen.getByText(/Echo: hi/i)).toBeInTheDocument();
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });

  it("renders message for empty history", async () => {
    mockFetchHistory.mockResolvedValueOnce([]);
    render(<PluginHistory />);
    await waitFor(() => {
      expect(
        screen.getByText(/no plugin history available/i)
      ).toBeInTheDocument();
    });
  });

  it("handles fetch failure gracefully", async () => {
    mockFetchHistory.mockRejectedValueOnce(new Error("Failed"));
    render(<PluginHistory />);
    await waitFor(() => {
      expect(
        screen.getByText(/failed to load plugin history/i)
      ).toBeInTheDocument();
    });
  });

  it("copies plugin input to clipboard on click", async () => {
    render(<PluginHistory />);
    const copyBtn = await screen.findByTestId("copy-input-1");

    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(clipboardSpy).toHaveBeenCalledWith(expect.stringContaining("hi"));
    });
  });
});
