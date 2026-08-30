import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

function Login() {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      localStorage.setItem("apiKey", apiKey);
      const response = await apiClient.get("/me");
      localStorage.setItem("tenantName", response.data.name);
      navigate("/dashboard");
    } catch (err) {
      localStorage.removeItem("apiKey");
      setError("Invalid API key. Please try again.");
    }
  }

  return (
    <div>
      <h1>KnowledgeSilo</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button type="submit">Log In</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Login;