import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  fetchPlugins,
  fetchPluginSpec,
  runPlugin,
} from "@/lib/services/pluginService";

import { PluginSpec } from "@/lib/types/plugin";

import { Card, CardContent } from "@/components/ui/card";
import PluginExecutionForm from "@/components/PluginExecutionForm";
import PluginResult from "@/components/plugin/PluginResult";

export default function PluginPanel() {
  const [plugins, setPlugins] = useState<PluginSpec[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">(
    "idle"
  );

  useEffect(() => {
    const loadPlugins = async () => {
      try {
        const data = await fetchPlugins();
        setPlugins(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch plugins:", err);
        toast.error("Failed to load plugins.");
        setPlugins([]);
      }
    };
    loadPlugins();
  }, []);

  const handleSelectPlugin = (pluginName: string) => {
    setSelected(pluginName);
    setResult(null);
    setStatus("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExecute = async (pluginName: string, inputs: Record<string, unknown>) => {
    setStatus("running");
    setResult(null);
    try {
      const res = await runPlugin(pluginName, inputs);
      const formatted =
        typeof res === "object" ? JSON.stringify(res, null, 2) : String(res);
      setResult(formatted);
      setStatus("success");
      toast.success(`✅ "${pluginName}" plugin executed!`);
      window.dispatchEvent(new Event("plugin-executed"));
    } catch (err) {
      console.error("Plugin execution failed:", err);
      toast.error("❌ Failed to execute plugin.");
      setStatus("error");
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
          <div className="space-y-6">
            <PluginExecutionForm
              pluginName={selected}
              fetchSpec={fetchPluginSpec}
              onExecute={handleExecute}
              loading={status === "running"}
            />

            {status === "success" && result && <PluginResult result={result} />}

            {status === "error" && (
              <p className="text-center text-red-600 font-semibold">
                ❌ Plugin execution failed.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
