import React, { useEffect, useState } from "react";
import axios from "axios";

const DeploymentLogs: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [logContent, setLogContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(true);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const response = await axios.get("/api/v1/logs");

      // ✅ Extract .data.data and verify it's an array
      const safeLogs = Array.isArray(response.data?.data) ? response.data.data : [];
      setLogs(safeLogs);
      setError(null);
    } catch (err) {
      console.error("❌ Failed to load logs:", err);
      setError("Failed to load logs.");
      setLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchLogContent = async (filename: string) => {
    setLoadingContent(true);
    try {
      const response = await axios.get(`/api/v1/logs/${filename}`, {
        responseType: "text",
      });
      setSelectedLog(filename);
      setLogContent(response.data);
    } catch {
      setError("Failed to load log content.");
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📦 Deployment Logs</h1>

      <button
        onClick={fetchLogs}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        🔄 Refresh Log List
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {loadingLogs ? (
        <p className="text-gray-500 animate-pulse">Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500 italic">No log files found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="font-semibold mb-2 text-gray-700">Available Logs</h2>
            <ul className="space-y-2">
              {logs.map((log) => (
                <li key={log}>
                  <button
                    onClick={() => fetchLogContent(log)}
                    className="text-blue-700 underline hover:text-blue-900 transition"
                  >
                    {log}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            {selectedLog && (
              <>
                <h2 className="font-semibold mb-2 text-gray-700">
                  Contents of: <span className="font-mono">{selectedLog}</span>
                </h2>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap max-h-[60vh] border">
                  {loadingContent
                    ? "Loading log content..."
                    : logContent?.trim() || "Log file is empty or failed to load."}
                </pre>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentLogs;
