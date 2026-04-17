function stripTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Canonical origin for this Next.js app (no trailing slash): sitemap, robots, metadata.
 *
 * This repo deploys the public site at https://amdari.io. The legacy Vite app lives at
 * https://app.amdari.io — do not use NEXT_PUBLIC_REDIRECT_URL here; that env often
 * points at the other app and would poison SEO URLs.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return stripTrailingSlashes(explicit);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return stripTrailingSlashes(`https://${vercel}`);

  return "https://amdari.io";
}
