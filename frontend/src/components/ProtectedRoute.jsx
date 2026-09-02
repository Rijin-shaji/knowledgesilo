import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const authToken = localStorage.getItem("authToken");
  const apiKey = localStorage.getItem("apiKey");

  if (!authToken && !apiKey) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;