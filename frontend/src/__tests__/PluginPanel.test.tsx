/// <reference types="vitest" />
import { vi } from "vitest"; // ✅ fallback

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PluginPanel from "../components/PluginPanel";

vi.mock("../lib/services/pluginService", () => ({
  fetchPlugins: vi.fn().mockResolvedValue([
    { name: "echo", description: "Returns input as output", module: "echo", class: "Echo" }
  ]),
  fetchPluginSpec: vi.fn().mockResolvedValue([
    { name: "input_text", type: "string", required: false, description: "Text to echo" }
  ]),
  runPlugin: vi.fn().mockResolvedValue({ result: "Echo: hello" }),
  formatPluginResult: (res: any) => JSON.stringify(res),
}));

describe("PluginPanel", () => {
  it("renders plugins and executes one", async () => {
    render(<PluginPanel />);

    await waitFor(() => screen.getByText("Returns input as output"));
    fireEvent.click(screen.getByText("Returns input as output"));

    const input = await screen.findByPlaceholderText("Enter input...");
    fireEvent.change(input, { target: { value: "hello" } });

    fireEvent.click(screen.getByText("Run Plugin"));

    await waitFor(() => screen.getByText(/Echo: hello/));
  });
});
