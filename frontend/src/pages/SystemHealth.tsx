import React, { useEffect, useState } from "react";
import api, { unwrapApiResponse } from "@/lib/services/api";

interface HealthResponse {
  backend: string;
  model: string;
}

const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/health");
      const data = unwrapApiResponse<HealthResponse>(res);
      setHealth(data);
      setError(null);
    } catch (err) {
      console.error("Health fetch error:", err);
      setError("Failed to fetch system health.");
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  //   const interval = setInterval(fetchHealth, 10000);
  //   return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">🩺 System Health</h1>

      {loading && (
        <p className="text-gray-500 animate-pulse">Loading system status...</p>
      )}
      {error && (
        <p className="text-red-600 font-medium bg-red-100 p-3 rounded">
          {error}
        </p>
      )}

      {health && (
        <div className="space-y-4 bg-gray-100 p-4 rounded shadow-sm border">
          <div className="flex justify-between items-center">
            <span className="font-medium">Backend:</span>
            <span
              data-testid="backend-status"
              className={`font-semibold ${
                health.backend.trim().toLowerCase() === "ok"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {health.backend}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Model:</span>
            <span
              data-testid="model-status"
              className={`font-semibold ${
                health.model.trim().toLowerCase() === "ok"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {health.model}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={fetchHealth}
        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        🔄 Refresh
      </button>
    </div>
  );
};

export default SystemHealth;
