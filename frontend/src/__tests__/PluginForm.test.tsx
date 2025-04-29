import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PluginForm, { PluginInputSpec } from "../components/PluginForm"; // ✅ Import both

describe("PluginForm", () => {
  const mockSpec: PluginInputSpec[] = [
    { name: "input1", label: "Text Field", type: "text", required: true },
    { name: "count", label: "Count", type: "number" },
    { name: "toggle", label: "Enable", type: "boolean" },
  ];

  const mockSubmit = jest.fn();

  beforeEach(() => {
    render(
      <PluginForm
        pluginName="TestPlugin"
        inputSpec={mockSpec}
        onSubmit={mockSubmit}
        status="idle"
      />,
    );
  });

  it("renders all input fields correctly", () => {
    expect(screen.getByLabelText("Text Field")).toBeInTheDocument();
    expect(screen.getByLabelText("Count")).toBeInTheDocument();
    expect(screen.getByLabelText("Enable")).toBeInTheDocument();
  });

  it("submits form with input values", () => {
    fireEvent.change(screen.getByLabelText("Text Field"), {
      target: { value: "test input" },
    });
    fireEvent.change(screen.getByLabelText("Count"), {
      target: { value: "42" },
    });
    fireEvent.click(screen.getByLabelText("Enable"));
    fireEvent.click(screen.getByText("Run Plugin"));

    expect(mockSubmit).toHaveBeenCalledWith({
      input1: "test input",
      count: 42,
      toggle: true,
    });
  });
});
