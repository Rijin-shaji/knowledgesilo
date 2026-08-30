import { useState, useEffect } from "react";
import apiClient from "../api/client";

function UsageStats() {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    fetchUsage();
  }, []);

  async function fetchUsage() {
    try {
      const response = await apiClient.get("/api/v1/usage/");
      setUsage(response.data);
    } catch (err) {
      console.error("Failed to fetch usage", err);
    }
  }

  if (!usage) return <p>Loading usage...</p>;

  return (
    <div>
      <h3>Usage</h3>
      <p>Total requests: {usage.total_requests}</p>
      <ul>
        {usage.by_endpoint.map((item) => (
          <li key={item.endpoint}>
            {item.endpoint}: {item.count}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsageStats;