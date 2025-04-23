import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface HealthResponse {
  backend: string;
  model: string;
}

const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/health');
      setHealth(res.data);
      setError(null);
    } catch (e) {
      setError('Failed to fetch health status');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">System Health</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {health && (
        <div className="space-y-2">
          <HealthItem label="Backend" status={health.backend} />
          <HealthItem label="Model" status={health.model} />
        </div>
      )}

      <button
        onClick={fetchHealth}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Refresh
      </button>
    </div>
  );
};

const HealthItem: React.FC<{ label: string; status: string }> = ({ label, status }) => {
  const color =
    status.toLowerCase() === 'ok' ? 'text-green-600' : 'text-red-600';

  return (
    <p className={color}>
      {label}: <span className="font-semibold">{status}</span>
    </p>
  );
};

export default SystemHealth;
