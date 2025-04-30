import React from "react";
import { Input } from "@/components/ui/input";

interface InputField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface Props {
  inputSpec?: InputField[];
  onChange: (name: string, value: string) => void;
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
            <Input
              id={name}
              name={name}
              type={type}
              required={required}
              onChange={(e) => onChange(name, e.target.value)}
            />
          </div>
        ))}
    </div>
  );
}
