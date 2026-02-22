import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Logic for token refresh or logout
        console.warn("Unauthorized access - redirecting to login...");
        // window.location.href = '/login';
      }

      // Handle 500 Server Errors
      if (error.response.status >= 500) {
        console.error("Server error:", error.response.data);
      }
    } else if (error.request) {
      // Network errors
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  },
);
