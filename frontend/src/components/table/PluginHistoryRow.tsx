import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PluginHistoryRowProps {
  id: number;
  plugin_name: string;
  input_data: Record<string, any>;
  output_data: Record<string, any>;
  status: string;
  timestamp: string;
}

const PluginHistoryRow = ({
  id,
  plugin_name,
  input_data,
  output_data,
  status,
  timestamp,
}: PluginHistoryRowProps) => {
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

  return (
    <tr key={`plugin-${id}`} className="hover:bg-gray-50 transition text-sm">
      <td className="border px-4 py-3 whitespace-nowrap">{plugin_name}</td>

      <td className="relative group border px-4 py-3 whitespace-pre-wrap break-words max-w-[280px] text-left text-xs">
        <span>{JSON.stringify(input_data)}</span>
        <Button
          onClick={() => handleCopy(input_data)}
          size="icon"
          variant="ghost"
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-xs"
          title="Copy input"
        >
          📋
        </Button>
      </td>

      <td className="relative group border px-4 py-3 whitespace-pre-wrap break-words max-w-[280px] text-left text-xs">
        <span>{JSON.stringify(output_data)}</span>
        <Button
          onClick={() => handleCopy(output_data)}
          size="icon"
          variant="ghost"
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-xs"
          title="Copy output"
        >
          📋
        </Button>
      </td>

      <td className="border px-4 py-3 text-center">
        <Badge
          variant={
            status === "success" ? "success" : status === "error" ? "destructive" : "outline"
          }
        >
          {status}
        </Badge>
      </td>

      <td className="border px-4 py-3 text-right text-xs text-gray-600 whitespace-nowrap">
        {new Date(timestamp).toLocaleString()}
      </td>
    </tr>
  );
};

export default PluginHistoryRow;
