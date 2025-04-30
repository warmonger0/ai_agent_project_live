import React, { useEffect, useState } from "react";
import axios from "axios";

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
      const res = await axios.get<HealthResponse>("/api/v1/health");
      setHealth(res.data);
      setError(null);
    } catch (err: unknown) {
      console.error("Health fetch error:", err);
      setError("Failed to fetch system health.");
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
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
          <HealthItem label="Backend" status={health.backend} />
          <HealthItem label="Model" status={health.model} />
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

const HealthItem: React.FC<{ label: string; status: string }> = ({
  label,
  status,
}) => {
  const normalized = status.trim().toLowerCase();
  const colorClass =
    normalized === "ok" ? "text-green-600" : "text-red-600";

  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{label}:</span>
      <span className={`font-semibold ${colorClass}`}>{status}</span>
    </div>
  );
};

export default SystemHealth;
