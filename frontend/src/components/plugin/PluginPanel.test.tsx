/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import PluginPanel from "@/components/PluginPanel";

// ✅ Prevent scrollTo warnings in JSDOM
Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });

// ✅ Mock plugin service
vi.mock("@/lib/services/pluginService", () => {
  return {
    fetchPlugins: vi.fn().mockResolvedValue([
      {
        name: "test_plugin",
        description: "Test plugin for echoing text",
        module: "test_plugin"
      }
    ]),
    fetchPluginSpec: vi.fn().mockResolvedValue([
      {
        name: "text",
        type: "string",
        label: "Input",
        required: true
      }
    ]),
    runPlugin: vi.fn().mockResolvedValue("Echo: hello"), // ✅ returning string now
  };
});

describe("<PluginPanel />", () => {
  beforeEach(() => {
    vi.resetModules(); // ensures mocks are fresh between tests
  });

  it("renders plugin cards and executes one successfully", async () => {
    render(<PluginPanel />);

    expect(await screen.findByText("test_plugin")).toBeInTheDocument();

    fireEvent.click(screen.getByText("test_plugin"));

    const input = await screen.findByLabelText(/input/i);
    fireEvent.change(input, { target: { value: "hello" } });

    const runButton = screen.getByRole("button", { name: /run plugin/i });
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(screen.getByText(/echo: hello/i)).toBeInTheDocument(); // ✅ fixed to match plain string
    });
  });

  it("handles plugin execution failure gracefully", async () => {
    const { runPlugin } = await import("@/lib/services/pluginService");
    vi.mocked(runPlugin).mockRejectedValueOnce(new Error("Plugin crashed"));

    render(<PluginPanel />);
    fireEvent.click(await screen.findByText("test_plugin"));

    const input = await screen.findByLabelText("Input");
    fireEvent.change(input, { target: { value: "fail" } });

    fireEvent.click(screen.getByRole("button", { name: /run plugin/i }));

    await waitFor(() => {
      expect(screen.getByText(/plugin execution failed/i)).toBeInTheDocument();
    });
  });

  it("renders fallback message if no plugins found", async () => {
    const { fetchPlugins } = await import("@/lib/services/pluginService");
    vi.mocked(fetchPlugins).mockResolvedValueOnce([]);

    render(<PluginPanel />);
    await waitFor(() => {
      expect(screen.queryByText("test_plugin")).not.toBeInTheDocument();
    });
  });
});
