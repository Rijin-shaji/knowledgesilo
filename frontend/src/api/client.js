import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

apiClient.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem("apiKey");
  if (apiKey) {
    config.headers["X-API-Key"] = apiKey;
  }
  return config;
});

export default apiClient;