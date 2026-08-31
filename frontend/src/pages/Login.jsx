import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const body = isSignup ? { name, email, password } : { email, password };

      const response = await apiClient.post(endpoint, body);

      localStorage.setItem("authToken", response.data.access_token);
      localStorage.setItem("tenantName", response.data.name);
      localStorage.removeItem("apiKey");

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <h1>KnowledgeSilo</h1>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
        {error && <p>{error}</p>}
      </form>
      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Already have an account? Log in" : "Need an account? Sign up"}
      </button>
    </div>
  );
}

export default Login;