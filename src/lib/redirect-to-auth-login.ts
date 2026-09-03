/** Redirects to the app sign-in page, preserving the current path for post-login return. */
export function redirectToAuthLogin() {
  if (typeof window === "undefined") return;

  const { pathname, search } = window.location;

  // Already on an auth screen — don't bounce (and never nest redirect=/auth/...).
  if (pathname.startsWith("/auth/")) return;

  const redirect = encodeURIComponent(`${pathname}${search}`);
  window.location.replace(`/auth/sign-in?redirect=${redirect}`);
}
