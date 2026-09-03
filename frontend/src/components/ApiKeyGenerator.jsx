import { useState, useEffect } from "react";
import apiClient from "../api/client";
import "./ApiKeyGenerator.css";

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
      <button className="btn-primary" onClick={() => setShowModal(true)}>
        + Create New API Key
      </button>

      <table className="api-keys-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Purpose</th>
            <th>Key</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((k) => (
            <tr key={k.id}>
              <td>{k.name || "(unnamed)"}</td>
              <td>{k.purpose || "—"}</td>
              <td className="api-keys-masked">••••{k.key_suffix || "----"}</td>
              <td>{new Date(k.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="api-key-modal">
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
              <button type="submit" className="btn-primary">Generate</button>
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p>Your new API key — save it now, it won't be shown again:</p>
              <code>{generatedKey}</code>
              <button className="btn-secondary" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
              <br />
              <button className="btn-primary" onClick={handleClose}>Done</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ApiKeyGenerator;