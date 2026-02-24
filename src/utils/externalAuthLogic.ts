const externalRedirect =
  process.env.NEXT_PUBLIC_REDIRECT_URL || "https://app.amdari.io";
const redirectAllowlist = (process.env.NEXT_PUBLIC_REDIRECT_ALLOWLIST || "")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);
const redirectTokenSalt =
  process.env.NEXT_PUBLIC_REDIRECT_TOKEN_SALT || "amdari-handoff-salt";
const redirectTokenKey =
  process.env.NEXT_PUBLIC_REDIRECT_TOKEN_KEY || redirectTokenSalt;
const AUTH_STORAGE_KEY = "amdari_user";

type PersistedAuth = {
  state?: {
    user?: {
      token?: string;
    };
  };
};

function getAccessTokenFromStorage(): string | null {
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

function toBase64Url(value: ArrayBuffer | Uint8Array): string {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function encryptTokenForRedirect(token: string): Promise<string | null> {
  if (typeof window === "undefined" || !window.crypto?.subtle) return null;

  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(redirectTokenKey),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(redirectTokenSalt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const payload = JSON.stringify({ token, ts: Date.now() });
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(payload),
  );

  return `${toBase64Url(iv)}.${toBase64Url(encryptedBuffer)}`;
}

function getFallbackRedirectUrl(): URL {
  const base = externalRedirect.replace(/\/+$/, "");
  return new URL(`${base}/dashboard`);
}

function resolveSafeRedirectUrl(redirectParam?: string): URL {
  const fallback = getFallbackRedirectUrl();
  if (!redirectParam) return fallback;

  try {
    const candidate = new URL(redirectParam);
    const fallbackHost = fallback.host.toLowerCase();
    const candidateHost = candidate.host.toLowerCase();

    const isAllowedHost =
      candidateHost === fallbackHost || redirectAllowlist.includes(candidateHost);
    const isHttp = candidate.protocol === "http:" || candidate.protocol === "https:";

    if (isHttp && isAllowedHost) {
      return candidate;
    }
  } catch {
    // Invalid absolute URL -> fallback.
  }

  return fallback;
}

export async function buildExternalAuthRedirectUrl(
  redirectParam?: string,
  providedToken?: string,
): Promise<string> {
  const redirectUrl = resolveSafeRedirectUrl(redirectParam);
  const token = providedToken || getAccessTokenFromStorage();

  if (token) {
    const encryptedToken = await encryptTokenForRedirect(token);
    if (encryptedToken) {
      redirectUrl.searchParams.set("token", encryptedToken);
    }
  }

  return redirectUrl.toString();
}
