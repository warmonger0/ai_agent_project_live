// /home/war/ai_agent_project/frontend/src/components/plugin/PluginResult.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PluginResultProps {
  result: string | null; // ✅ Accepts a formatted string, not an object
}

export default function PluginResult({ result }: PluginResultProps) {
  const output = result ?? "No output";

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(output);
        toast.success("Copied result to clipboard!");
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = output;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        toast.success("Copied manually!");
      }
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy to clipboard.");
    }
  };

  return (
    <div className="relative mt-6 bg-gray-100 rounded p-4 text-xs overflow-x-auto max-w-full">
      <Button
        onClick={handleCopy}
        variant="secondary"
        size="sm"
        className="absolute top-2 right-2 text-xs"
        title="Copy result"
      >
        📋 Copy
      </Button>
      <pre className="whitespace-pre-wrap break-words">
        {output}
      </pre>
    </div>
  );
}
