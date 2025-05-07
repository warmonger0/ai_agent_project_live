/// <reference types="vitest" />

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PluginResult from "../components/plugin/PluginResult";

describe("PluginResult", () => {
  it("renders plugin output when result is valid", () => {
    const result = "Hello from plugin!";

    render(<PluginResult result={result} />);

    expect(screen.getByText(/hello from plugin/i)).toBeInTheDocument();
    expect(screen.queryByText(/no output/i)).not.toBeInTheDocument();
  });

  it("renders fallback message when result is null", () => {
    render(<PluginResult result={null} />);
    expect(screen.getByText(/no output/i)).toBeInTheDocument();
  });
});
