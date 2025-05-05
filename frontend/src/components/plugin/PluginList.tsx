// PluginList.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { PluginSpec } from "@/lib/types/plugin";

interface PluginListProps {
  plugins: PluginSpec[];
  selected: string | null;
  onSelect: (pluginName: string) => void;
}

export const PluginList: React.FC<PluginListProps> = ({ plugins, selected, onSelect }) => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    {plugins.map((plugin) => (
      <Card
        key={plugin.module || plugin.name}
        onClick={() => onSelect(plugin.module || plugin.name)}
        className={`cursor-pointer transition p-4 text-center ${
          selected === (plugin.module || plugin.name) ? "ring-2 ring-blue-500" : ""
        }`}
      >
        <p className="font-semibold">{plugin.name}</p>
        <p className="text-xs text-gray-500">{plugin.description}</p>
      </Card>
    ))}
  </div>
);
