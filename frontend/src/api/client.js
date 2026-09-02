import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

apiClient.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken");
  const apiKey = localStorage.getItem("apiKey");

  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  } else if (apiKey) {
    config.headers["X-API-Key"] = apiKey;
  }

  return config;
});

export default apiClient;