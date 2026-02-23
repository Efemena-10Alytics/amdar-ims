const externalRedirect =
  process.env.NEXT_PUBLIC_REDIRECT_URL || "https://app.amdari.io";
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

export async function buildExternalAuthRedirectUrl(
  redirectParam?: string,
  providedToken?: string,
): Promise<string> {
  const params = new URLSearchParams();
  const token = providedToken || getAccessTokenFromStorage();

  if (token) {
    const encryptedToken = await encryptTokenForRedirect(token);
    if (encryptedToken) {
      params.set("token", encryptedToken);
    }
  }

  if (redirectParam) {
    params.set("redirect", redirectParam);
  }

  const query = params.toString();
  return query ? `${externalRedirect}/dashboard?${query}` : externalRedirect;
}
