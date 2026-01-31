import axios, { type InternalAxiosRequestConfig } from "axios";

export const apiBaseURL =
  process.env.NEXT_PUBLIC_REACT_APP_API_URL ?? "";

export const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token, tenant, etc. here if needed
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401, 403, 500 etc. globally if needed
    // if (error.response?.status === 401) { ... }
    return Promise.reject(error);
  }
);
