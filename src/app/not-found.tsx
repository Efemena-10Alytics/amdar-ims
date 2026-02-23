"use client";

import { useEffect } from "react";

const fallbackRedirect =
  process.env.NEXT_PUBLIC_REDIRECT_URL || "https://app.amdari.io";

function buildLegacyRedirectUrl(
  baseUrl: string,
  path: string,
  query: string,
): string {
  const base = baseUrl.replace(/\/+$/, "");
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${safePath}${query}`;
}

export default function NotFound() {
  useEffect(() => {
    const pathname = window.location.pathname || "/";
    const queryString = window.location.search || "";
    const redirectUrl = buildLegacyRedirectUrl(
      fallbackRedirect,
      pathname,
      queryString,
    );

    window.location.replace(redirectUrl);
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#D1E3E6] border-t-[#0F4652] animate-spin" />
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-[#64748B]">Amdari</p>
        </div>
      </div>
    </main>
  );
}
