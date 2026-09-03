import { useState, useEffect } from "react";
import apiClient from "../api/client";
import "./UsageStats.css";

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
function friendlyEndpointName(endpoint) {
  const labels = {
    "POST /api/v1/documents/upload": "File uploads",
    "POST /api/v1/documents/upload-url": "URL uploads",
    "POST /api/v1/query/": "Questions asked",
    "POST /api/v1/query/stream": "Questions asked",
    "GET /api/v1/documents/": "Document list views",
    "GET /me": "Login checks",
    "GET /": "Other activity",
  };
  return labels[endpoint] || endpoint;
}
  if (!usage) return <p>Loading usage...</p>;

    return (
    <div className="usage-container">
      <div className="usage-total-card">
        <span className="usage-total-number">{usage.total_requests}</span>
        <span className="usage-total-label">Total requests</span>
      </div>

      <div className="usage-breakdown">
        {usage.by_endpoint
          .sort((a, b) => b.count - a.count)
          .map((item) => (
            <div key={item.endpoint} className="usage-row">
              <span className="usage-row-label">{friendlyEndpointName(item.endpoint)}</span>
              <div className="usage-bar-track">
                <div
                  className="usage-bar-fill"
                  style={{ width: `${(item.count / usage.total_requests) * 100}%` }}
                />
              </div>
              <span className="usage-row-count">{item.count}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default UsageStats;