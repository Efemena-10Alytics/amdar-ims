"use client";

import { useEffect } from "react";
import { axiosInstance } from "@/lib/axios-instance";
import { useAuthStore } from "@/store/auth-store";

const AUTH_STORAGE_KEY = "amdari_user";

export default function LogoutPage() {
  useEffect(() => {
    let cancelled = false;

    const runLogout = async () => {
      try {
        await axiosInstance.post("logout");
      } catch {
        // Best effort: always continue local logout even if API call fails.
      } finally {
        useAuthStore.getState().logout();
        localStorage.removeItem(AUTH_STORAGE_KEY);
        if (!cancelled) {
          window.location.replace("/auth/sign-in");
        }
      }
    };

    runLogout();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#D1E3E6] border-t-[#0F4652] animate-spin" />
        <p className="text-sm text-[#64748B]">Signing out...</p>
      </div>
    </main>
  );
}
