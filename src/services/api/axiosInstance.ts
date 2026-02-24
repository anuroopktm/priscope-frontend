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
    const token = localStorage.getItem("access_token");
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
  async (error: AxiosError<any>) => {
    if (Array.isArray(error.response?.data?.detail)) {
      const formattedErrors = error.response.data.detail.map(
        (err: any) => err.msg,
      );
      error.response.data.detail = formattedErrors.join("\n");
    }

    if (error.response?.status === 401) {
      console.warn("Unauthorized access - redirecting to login...");
      localStorage.clear();
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  },
);
