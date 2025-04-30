import { useEffect, useState } from "react";
import { toast } from "sonner";

import { fetchPluginHistory } from "@/lib/services/pluginService";
import { PluginExecution } from "@/lib/types/plugin";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PluginHistory() {
  const [history, setHistory] = useState<PluginExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchPluginHistory();
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          console.warn("Unexpected plugin history format:", data);
          setHistory([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching plugin history:", err);
        setError("Failed to load plugin history.");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    const handlePluginExecuted = () => loadHistory();
    window.addEventListener("plugin-executed", handlePluginExecuted);

    return () => {
      window.removeEventListener("plugin-executed", handlePluginExecuted);
    };
  }, []);

  const handleCopy = async (content: Record<string, unknown>) => {
    try {
      const text = JSON.stringify(content, null, 2);
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        toast.success("Copied manually!");
      }
    } catch {
      toast.error("Failed to copy.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-gray-500 text-center animate-pulse">
        Loading plugin history...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <Card className="p-6 mt-8">
      <CardContent>
        <h2 className="text-2xl font-bold mb-6">📜 Plugin Execution History</h2>

        {history.length === 0 ? (
          <div className="text-gray-500 text-center p-6 italic">
            No plugin history available yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <Table className="min-w-full text-sm">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="py-3 px-4 text-left">Plugin</TableHead>
                  <TableHead className="py-3 px-4 text-left">Input</TableHead>
                  <TableHead className="py-3 px-4 text-left">Output</TableHead>
                  <TableHead className="py-3 px-4 text-center">Status</TableHead>
                  <TableHead className="py-3 px-4 text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-gray-50 transition">
                    <TableCell className="font-medium py-3 px-4 whitespace-nowrap">
                      {entry.plugin_name}
                    </TableCell>

                    <TableCell className="relative group text-xs max-w-[280px] whitespace-pre-wrap break-words py-3 px-4">
                      <span>{JSON.stringify(entry.input_data)}</span>
                      <Button
                        onClick={() => handleCopy(entry.input_data)}
                        size="icon"
                        variant="ghost"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-xs"
                        title="Copy input"
                      >
                        📋
                      </Button>
                    </TableCell>

                    <TableCell className="relative group text-xs max-w-[280px] whitespace-pre-wrap break-words py-3 px-4">
                      <span>{JSON.stringify(entry.output_data)}</span>
                      <Button
                        onClick={() => handleCopy(entry.output_data)}
                        size="icon"
                        variant="ghost"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-xs"
                        title="Copy output"
                      >
                        📋
                      </Button>
                    </TableCell>

                    <TableCell className="text-center py-3 px-4">
                      <Badge
                        variant={
                          entry.status === "success" ? "success" : "destructive"
                        }
                      >
                        {entry.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-gray-600 whitespace-nowrap py-3 px-4 text-right">
                      {new Date(entry.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
