import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatPluginResult } from "@/lib/services/pluginService";

interface Props {
  pluginName: string;
  onExecute: (pluginName: string, inputText: string) => Promise<unknown>;
  disabled?: boolean;
}

export default function PluginExecutionForm({
  pluginName,
  onExecute,
  disabled = false,
}: Props) {
  const [inputText, setInputText] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setStatus("running");
    setResult(null);

    try {
      const output = await onExecute(pluginName, inputText);
      const display = formatPluginResult(output);
      setResult(display);
      setStatus("success");
      toast.success(`Plugin "${pluginName}" executed successfully!`);
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error(`Failed to execute plugin "${pluginName}".`);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Copy failed", err);
      toast.error("Failed to copy result.");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center">Input for: {pluginName}</h3>

      <Input
        ref={inputRef}
        placeholder="Enter input..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={status === "running" || disabled}
      />

      <div className="flex justify-center">
        <Button onClick={handleSubmit} disabled={status === "running" || disabled}>
          {status === "running" ? "Running..." : "Run Plugin"}
        </Button>
      </div>

      {status === "success" && result && (
        <div className="relative mt-6 bg-gray-100 rounded p-4 text-xs overflow-x-auto max-w-full">
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 text-xs"
          >
            📋 Copy
          </Button>
          <pre className="whitespace-pre-wrap break-words">{result}</pre>
        </div>
      )}

      {status === "error" && (
        <p className="mt-4 text-center text-red-600 font-semibold">
          Error executing plugin.
        </p>
      )}
    </div>
  );
}
