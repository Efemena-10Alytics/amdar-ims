import axios, { type InternalAxiosRequestConfig } from "axios";

const AUTH_STORAGE_KEY = "amdari_user";

export const apiBaseURL =
  process.env.NEXT_PUBLIC_REACT_APP_API_URL ?? "";

/** Persisted shape: { state: { user: { user: {...}, token: "..." } }, version: 0 } */
type PersistedAuth = {
  state?: {
    user?: {
      user?: unknown;
      token?: string;
    };
  };
  version?: number;
};

/** Reads the access token from amdari_user in localStorage (Zustand persist: state.user.token). */
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as PersistedAuth;
    const token = stored.state?.user?.token;
    return typeof token === "string" ? token : null;
  } catch {
    return null;
  }
}

export const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach Bearer token from persisted user
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
