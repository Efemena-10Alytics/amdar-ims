import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AuthUser = Record<string, unknown>;

export type AuthState = {
  user: AuthUser | null;
  isLoggingIn: boolean;
  setUser: (user: AuthUser | null) => void;
  setIsLoggingIn: (value: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggingIn: false,
      setUser: (user) => set({ user }),
      setIsLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
      logout: () => set({ user: null }),
    }),
    {
      name: "amdari_user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
