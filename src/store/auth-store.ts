import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AuthUser = Record<string, unknown>;

export type AuthState = {
  user: AuthUser | null;
  isLoggingIn: boolean;
  /** Set by axios 401 handler when on payment page – payment UI opens sign-in modal. */
  showSignInModalDueTo401: boolean;
  setUser: (user: AuthUser | null) => void;
  setIsLoggingIn: (value: boolean) => void;
  setShowSignInModalDueTo401: (show: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggingIn: false,
      showSignInModalDueTo401: false,
      setUser: (user) => set({ user }),
      setIsLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
      setShowSignInModalDueTo401: (show) => set({ showSignInModalDueTo401: show }),
      logout: () => set({ user: null }),
    }),
    {
      name: "amdari_user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
