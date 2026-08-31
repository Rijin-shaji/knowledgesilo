import { useState } from "react";
import apiClient from "../api/client";

function ApiKeyGenerator() {
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const response = await apiClient.post("/api/v1/api-keys/");
      setApiKey(response.data.api_key);
    } catch (err) {
      console.error("Failed to generate API key", err);
    }
    setLoading(false);
  }

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate API Key"}
      </button>
      {apiKey && (
        <div>
          <p>Your new API key (save it now — it won't be shown again):</p>
          <code>{apiKey}</code>
        </div>
      )}
    </div>
  );
}

export default ApiKeyGenerator;