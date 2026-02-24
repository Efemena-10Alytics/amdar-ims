import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";

const AUTH_STORAGE_KEY = "amdari_user";

function clearAuthAndLogout() {
  useAuthStore.getState().logout();
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

function handle401() {
  clearAuthAndLogout();
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  const currentPath = pathname + search;
  const isPaymentPage = pathname.startsWith("/payment/");
  if (isPaymentPage) {
    useAuthStore.getState().setShowSignInModalDueTo401(true);
  } else {
    const redirect = encodeURIComponent(currentPath);
    window.location.replace(`/auth/sign-in?redirect=${redirect}`);
  }
}

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

// Response interceptor: on 401, log out and clear persisted auth
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handle401();
    }
    return Promise.reject(error);
  }
);
