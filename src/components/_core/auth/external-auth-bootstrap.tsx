"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";
import { useAuthStore, type AuthUser } from "@/store/auth-store";
import {
  consumeExternalAuthTokenFromUrl,
  hasHandoffToken,
} from "@/utils/externalAuthLogic";

type Status = "checking" | "applying" | "done";

/**
 * Fetches the account behind a handed-off token and shapes it the way
 * `useLogin` stores a normal sign-in: the API's `data` envelope, with `token`
 * at the top level and the account under `user`. Both `getUserId` and the axios
 * token reader depend on that exact shape.
 */
async function buildAuthUserFromToken(token: string): Promise<AuthUser> {
  const { data } = await axiosInstance.get("user", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const apiData = data?.data;
  const user = apiData?.user ?? apiData ?? null;

  return {
    ...(apiData && typeof apiData === "object" ? apiData : {}),
    token,
    user,
  };
}

/**
 * Applies a `?token=` handoff from the legacy app before anything below it can
 * mount.
 *
 * It must gate its children rather than render alongside them: hooks like
 * `useRequireUserId` redirect to sign-in the moment they see no user, and child
 * effects run before parent effects — so a non-blocking version would bounce
 * the very user it is trying to sign in.
 */
export function ExternalAuthBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;

    // The overwhelmingly common case: no handoff in the URL, so get out of the
    // way in the same tick rather than showing a loader.
    if (!hasHandoffToken()) {
      setStatus("done");
      return;
    }

    setStatus("applying");

    const apply = async () => {
      const handoff = await consumeExternalAuthTokenFromUrl();
      if (cancelled) return;

      if (!handoff.applied || !handoff.token) {
        // Expired or tampered-with link. Fall through unauthenticated and let
        // the normal auth guards send them to sign-in.
        setStatus("done");
        return;
      }

      try {
        const authUser = await buildAuthUserFromToken(handoff.token);
        if (cancelled) return;
        useAuthStore.getState().setUser(authUser);
      } catch {
        // Token decrypted but the API rejected it — treat as signed out.
        if (cancelled) return;
        useAuthStore.getState().logout();
      } finally {
        if (!cancelled) setStatus("done");
      }
    };

    apply();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status !== "done") {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-[#64748B]">
          {status === "applying" ? "Signing you in..." : "Loading..."}
        </p>
      </div>
    );
  }

  return children;
}

export default ExternalAuthBootstrap;
