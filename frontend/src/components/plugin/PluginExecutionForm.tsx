import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // ✅ Only if you use Radix/your custom checkbox

interface InputField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface Props {
  inputSpec?: InputField[];
  onChange: (name: string, value: string | boolean) => void;
}

export default function PluginExecutionForm({ inputSpec = [], onChange }: Props) {
  return (
    <div className="space-y-4">
      {Array.isArray(inputSpec) &&
        inputSpec.map(({ name, label, type, required }) => (
          <div key={name} className="space-y-2">
            <label htmlFor={name} className="block font-medium text-sm">
              {label}
            </label>

            {type === "boolean" ? (
              <input
                id={name}
                name={name}
                type="checkbox"
                onChange={(e) => onChange(name, e.target.checked)}
              />
            ) : (
              <Input
                id={name}
                name={name}
                type={type}
                required={required}
                placeholder="Enter input..."
                onChange={(e) => onChange(name, e.target.value)}
              />
            )}
          </div>
        ))}
    </div>
  );
}
