import { useState, useEffect } from "react";
import apiClient from "../api/client";

function ApiKeyGenerator() {
  const [keys, setKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [generatedKey, setGeneratedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    try {
      const response = await apiClient.get("/api/v1/api-keys/");
      setKeys(response.data);
    } catch (err) {
      console.error("Failed to fetch API keys", err);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const response = await apiClient.post("/api/v1/api-keys/", { name, purpose });
      setGeneratedKey(response.data.api_key);
    } catch (err) {
      console.error("Failed to create API key", err);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
  }

  function handleClose() {
    setShowModal(false);
    setName("");
    setPurpose("");
    setGeneratedKey(null);
    setCopied(false);
    fetchKeys();
  }

  return (
    <div>
      <h3>API Keys</h3>
      <button onClick={() => setShowModal(true)}>+ Create New API Key</button>

      <ul>
        {keys.map((k) => (
          <li key={k.id}>
            {k.name || "(unnamed)"} — {k.purpose || "no purpose set"} — ****{k.key_suffix || "----"} — created {new Date(k.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>

      {showModal && (
        <div style={{ border: "1px solid #666", padding: "20px", marginTop: "10px" }}>
          {!generatedKey ? (
            <form onSubmit={handleCreate}>
              <div>
                <input
                  type="text"
                  placeholder="Key name (e.g. Production Server)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Purpose (e.g. Backend integration for our app)"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Generate</button>
              <button type="button" onClick={handleClose}>Cancel</button>
            </form>
          ) : (
            <div>
              <p>Your new API key — save it now, it won't be shown again:</p>
              <code>{generatedKey}</code>
              <button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
              <br />
              <button onClick={handleClose}>Done</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ApiKeyGenerator;