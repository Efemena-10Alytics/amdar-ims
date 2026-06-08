"use client";

import { useEffect, useState } from "react";
import { getUserId } from "@/lib/get-user-id";
import { redirectToAuthLogin } from "@/lib/redirect-to-auth-login";
import { useAuthStore } from "@/store/auth-store";

export function useRequireUserId() {
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const verifyAuth = () => {
      const currentUserId = getUserId(useAuthStore.getState().user);

      if (currentUserId == null || currentUserId === "") {
        redirectToAuthLogin();
        return;
      }

      setIsAuthReady(true);
    };

    if (useAuthStore.persist.hasHydrated()) {
      verifyAuth();
      return;
    }

    return useAuthStore.persist.onFinishHydration(verifyAuth);
  }, []);

  return { userId, isAuthReady };
}
