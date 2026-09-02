import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import logo from "../assets/logo.png";
import "./Login.css";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (isSignup) {
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const body = isSignup ? {name, email, password} : {email, password};

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
      <div className="auth-page">
        <div className="auth-card">
          <img src={logo} alt="DocuVault AI" className="auth-logo"/>
          <p className="auth-tagline">Upload. Ask. Understand.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {isSignup && (
                <div className="form-field">
                  <label>Name</label>
                  <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                  />
                </div>
            )}
            <div className="form-field">
              <label>Email</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isSignup && (
                <div className="form-field">
                  <label>Confirm password</label>
                  <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
            )}

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn-primary">
              {isSignup ? "Create account" : "Log in"}
            </button>
          </form>
            <p className="auth-switch">
  {isSignup ? (
    <>Already have an account? <Link to="/login">Log in</Link></>
  ) : (
    <>Need an account? <Link to="/signup">Sign up</Link></>
  )}
</p>
        </div>
      </div>
  );
}

export default Login;