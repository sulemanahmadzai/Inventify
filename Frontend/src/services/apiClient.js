import axios from "axios";

// Create an instance of axios with default config
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Your backend URL
  timeout: 10000, // Timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests for adding tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like authentication failures
    if (error.response?.status === 401) {
      // Redirect to login or show a message
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
