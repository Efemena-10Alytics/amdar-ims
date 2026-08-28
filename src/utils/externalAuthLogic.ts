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

/**
 * How long a handoff token stays valid. Must match the legacy app's
 * VITE_REDIRECT_TOKEN_MAX_AGE_MS, or links minted by one app are rejected by
 * the other.
 */
const redirectTokenMaxAgeMs = Number(
  process.env.NEXT_PUBLIC_REDIRECT_TOKEN_MAX_AGE_MS || 10 * 60 * 1000,
);

export const HANDOFF_TOKEN_PARAM = "token";

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
  return new URL(`${base}/dashboard/internship`);
}

function isSafePathname(pathname: string): boolean {
  const safePaths = ["/dashboard", "/onboarding", "/pre-diagnostic-test", "/setup"];
  return safePaths.some(
    (safe) => pathname === safe || pathname.startsWith(`${safe}/`),
  );
}

function resolveSafeRedirectUrl(redirectParam?: string): URL {
  const fallback = getFallbackRedirectUrl();
  if (!redirectParam) return fallback;

  const trimmed = redirectParam.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    const baseOrigin =
      typeof window !== "undefined"
        ? window.location.origin
        : new URL(externalRedirect.replace(/\/+$/, "")).origin;
    try {
      const resolved = new URL(trimmed, `${baseOrigin}/`);
      const isHttp =
        resolved.protocol === "http:" || resolved.protocol === "https:";
      if (
        isHttp &&
        resolved.origin === baseOrigin &&
        isSafePathname(resolved.pathname)
      ) {
        return resolved;
      }
    } catch {
      // fall through to absolute URL handling
    }
  }

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

  const isSameOriginAsCurrent =
    typeof window !== "undefined" &&
    redirectUrl.origin === window.location.origin;

  if (token && !isSameOriginAsCurrent) {
    const encryptedToken = await encryptTokenForRedirect(token);
    if (encryptedToken) {
      redirectUrl.searchParams.set("token", encryptedToken);
    }
  }

  return redirectUrl.toString();
}

/* -------------------------------------------------------------------------- */
/* Inbound handoff (legacy -> Next)                                            */
/*                                                                            */
/* Mirror image of the legacy app's consumeExternalAuthTokenFromUrl. The two   */
/* must stay byte-compatible: same salt, key, PBKDF2 iterations, digest, and   */
/* payload envelope. Changing either side alone silently breaks the handoff —  */
/* decryption just throws and the user lands on the sign-in page.              */
/* -------------------------------------------------------------------------- */

// Backed by an explicit ArrayBuffer so the result satisfies BufferSource —
// a bare `new Uint8Array(n)` widens to ArrayBufferLike, which SubtleCrypto rejects.
function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

type HandoffPayload = { token: string; ts: number };

async function decryptHandoffPayload(
  rawParamToken: string,
): Promise<HandoffPayload | null> {
  if (typeof window === "undefined" || !window.crypto?.subtle) return null;
  if (!rawParamToken) return null;

  const [ivPart, cipherPart] = rawParamToken.split(".");
  if (!ivPart || !cipherPart) return null;

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
    ["decrypt"],
  );

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64Url(ivPart) },
    key,
    fromBase64Url(cipherPart),
  );

  const payload = JSON.parse(new TextDecoder().decode(decryptedBuffer));
  if (typeof payload?.token !== "string" || typeof payload?.ts !== "number") {
    return null;
  }

  return payload as HandoffPayload;
}

/** Rejects replayed links and clocks that disagree by more than the window. */
function isPayloadFresh(payloadTs: number): boolean {
  const age = Date.now() - payloadTs;
  return age >= 0 && age <= redirectTokenMaxAgeMs;
}

/**
 * Sanctum issues opaque `id|hash` tokens, not JWTs, so a non-JWT is normal and
 * only its length is checked. A well-formed JWT additionally has to be unexpired.
 */
function isTokenUsable(token: string): boolean {
  if (token.length <= 10) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return true;

  try {
    const claims = JSON.parse(
      new TextDecoder().decode(fromBase64Url(parts[1])),
    );
    if (typeof claims?.exp !== "number") return true;
    return claims.exp * 1000 > Date.now();
  } catch {
    return true;
  }
}

function stripHandoffTokenFromUrl(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has(HANDOFF_TOKEN_PARAM)) return;
  url.searchParams.delete(HANDOFF_TOKEN_PARAM);
  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}

export function hasHandoffToken(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has(HANDOFF_TOKEN_PARAM);
}

export type HandoffResult = { applied: boolean; token: string | null };

/**
 * Reads `?token=` minted by the legacy app, and returns the access token it
 * carries. Always strips the parameter, valid or not, so a failed handoff is not
 * retried on refresh and the token does not linger in the address bar.
 */
export async function consumeExternalAuthTokenFromUrl(): Promise<HandoffResult> {
  if (typeof window === "undefined") return { applied: false, token: null };

  const handoffToken = new URLSearchParams(window.location.search).get(
    HANDOFF_TOKEN_PARAM,
  );
  if (!handoffToken) return { applied: false, token: null };

  try {
    const payload = await decryptHandoffPayload(handoffToken);

    if (
      !payload ||
      !isPayloadFresh(payload.ts) ||
      !isTokenUsable(payload.token)
    ) {
      stripHandoffTokenFromUrl();
      return { applied: false, token: null };
    }

    stripHandoffTokenFromUrl();
    return { applied: true, token: payload.token };
  } catch {
    stripHandoffTokenFromUrl();
    return { applied: false, token: null };
  }
}

export { AUTH_STORAGE_KEY };
