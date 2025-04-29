// /frontend/src/components/PluginForm.tsx

import React, { useState } from "react";

// ✅ Exporting type for use elsewhere (tests, forms, etc.)
export type PluginInputSpec = {
  name: string;
  label: string;
  type: "text" | "number" | "boolean";
  required?: boolean;
};

type PluginFormProps = {
  pluginName: string;
  inputSpec: PluginInputSpec[];
  onSubmit: (inputs: Record<string, unknown>) => void;
  status?: "idle" | "running" | "success" | "error";
  result?: unknown;
};

const PluginForm: React.FC<PluginFormProps> = ({
  pluginName,
  inputSpec,
  onSubmit,
  status = "idle",
  result,
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      className="p-4 rounded-xl border border-gray-300 shadow-md bg-white"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-semibold mb-4">Run {pluginName} Plugin</h2>

      {inputSpec.map(({ name, label, type, required }) => (
        <div key={name} className="mb-3">
          <label className="block font-medium mb-1">{label}</label>
          {type === "boolean" ? (
            <input
              type="checkbox"
              onChange={(e) => handleChange(name, e.target.checked)}
              className="mr-2"
            />
          ) : (
            <input
              type={type}
              required={required}
              className="border px-3 py-2 rounded w-full"
              onChange={(e) => handleChange(name, e.target.value)}
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={status === "running"}
      >
        {status === "running" ? "Running..." : "Run Plugin"}
      </button>

      {status === "success" && result && (
        <pre className="mt-4 bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap break-words overflow-x-auto">
          {typeof result === "object"
            ? JSON.stringify(result, null, 2)
            : String(result)}
        </pre>
      )}

      {status === "error" && (
        <div className="mt-4 text-red-600 font-semibold">
          Plugin execution failed.
        </div>
      )}
    </form>
  );
};

export default PluginForm;
