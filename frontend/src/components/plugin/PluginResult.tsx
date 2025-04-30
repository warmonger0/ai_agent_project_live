import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PluginResultProps {
  result: string;
}

export default function PluginResult({ result }: PluginResultProps) {
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(result);
        toast.success("Copied result to clipboard!");
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = result;
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
      >
        📋 Copy
      </Button>
      <pre className="whitespace-pre-wrap break-words">{result}</pre>
    </div>
  );
}
