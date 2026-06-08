/** Redirects to the app sign-in page, preserving the current path for post-login return. */
export function redirectToAuthLogin() {
  if (typeof window === "undefined") return;

  const redirect = encodeURIComponent(
    `${window.location.pathname}${window.location.search}`,
  );
  window.location.replace(`/auth/sign-in?redirect=${redirect}`);
}
