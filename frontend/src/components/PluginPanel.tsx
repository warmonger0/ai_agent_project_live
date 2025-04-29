import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { fetchPlugins, runPlugin } from "@/lib/services/pluginService";
import { PluginSpec } from "@/lib/types/plugin";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PluginPanel() {
  const [plugins, setPlugins] = useState<PluginSpec[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "running" | "success" | "error"
  >("idle");
  const [result, setResult] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPlugins = async () => {
      try {
        const data = await fetchPlugins();
        setPlugins(data);
      } catch (err) {
        console.error("Failed to fetch plugins:", err);
      }
    };
    loadPlugins();
  }, []);

  const handleRunPlugin = async () => {
    if (!selected) return;
    setStatus("running");
    setResult(null);

    try {
      const finalResult = await runPlugin(selected, inputText);
      setResult(
        typeof finalResult === "object"
          ? JSON.stringify(finalResult, null, 2)
          : finalResult,
      );
      setStatus("success");
      toast.success(`Plugin "${selected}" executed successfully!`);
      window.dispatchEvent(new Event("plugin-executed"));
    } catch (err) {
      console.error("Error running plugin:", err);
      setStatus("error");
      toast.error(`Failed to execute plugin "${selected}".`);
    }
  };

  const handleSelectPlugin = (pluginName: string) => {
    setSelected(pluginName);
    setInputText("");
    setResult(null);
    setStatus("idle");

    inputContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const handleCopyResult = async () => {
    if (!result) return;
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
    <Card className="p-6 space-y-8 bg-white rounded-lg shadow-sm">
      <CardContent className="space-y-8">
        <h2 className="text-2xl font-bold text-center">🧩 Plugin Panel</h2>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {plugins.map((plugin) => (
            <Card
              key={plugin.module || plugin.name}
              onClick={() => handleSelectPlugin(plugin.module || plugin.name)}
              className={`cursor-pointer transition p-4 text-center ${
                selected === (plugin.module || plugin.name)
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
            >
              <p className="font-semibold">{plugin.name}</p>
              <p className="text-xs text-gray-500">{plugin.description}</p>
            </Card>
          ))}
        </div>

        {selected && (
          <div
            ref={inputContainerRef}
            className="space-y-4 mt-6 max-w-2xl mx-auto"
            id="plugin-input-form"
          >
            <h3 className="text-lg font-medium text-center">
              Input for: {selected}
            </h3>

            <Input
              ref={inputRef}
              placeholder="Enter input..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={status === "running"}
            />

            <div className="flex justify-center">
              <Button onClick={handleRunPlugin} disabled={status === "running"}>
                {status === "running" && (
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                {status === "running" ? "Running..." : "Run Plugin"}
              </Button>
            </div>

            {status === "success" && result && (
              <div className="relative mt-6 bg-gray-100 rounded p-4 text-xs overflow-x-auto max-w-full">
                <Button
                  onClick={handleCopyResult}
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
        )}
      </CardContent>
    </Card>
  );
}
