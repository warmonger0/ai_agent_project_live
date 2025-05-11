/// <reference types="vitest" />
import { vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PluginExecutionForm from "@/components/plugin/PluginExecutionForm";

const mockSpec = [
  { name: "input1", label: "Text Field", type: "text", required: true },
  { name: "count", label: "Count", type: "number" },
  { name: "toggle", label: "Enable", type: "boolean" }, // ✅ use actual boolean type
];

describe("PluginExecutionForm", () => {
  const mockChange = vi.fn();

  beforeEach(() => {
    mockChange.mockClear();
    render(<PluginExecutionForm inputSpec={mockSpec} onChange={mockChange} />);
  });

  it("renders all input fields correctly", () => {
    expect(screen.getByLabelText("Text Field")).toBeInTheDocument();
    expect(screen.getByLabelText("Count")).toBeInTheDocument();
    expect(screen.getByLabelText("Enable")).toBeInTheDocument();
  });

  it("calls onChange for input fields", () => {
    fireEvent.change(screen.getByLabelText("Text Field"), {
      target: { value: "test input" },
    });
    expect(mockChange).toHaveBeenCalledWith("input1", "test input");

    fireEvent.change(screen.getByLabelText("Count"), {
      target: { value: "42" },
    });
    expect(mockChange).toHaveBeenCalledWith("count", "42");

    fireEvent.click(screen.getByLabelText("Enable")); // ✅ simulate checkbox click
    expect(mockChange).toHaveBeenCalledWith("toggle", true);
  });
});
