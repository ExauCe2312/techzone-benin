// Authentification admin minimaliste : pas de table "sessions" en base —
// un cookie signé (HMAC, Web Crypto) suffit pour un seul utilisateur.
// Compatible Node.js et Edge runtime (utilisé par middleware.ts).

const encoder = new TextEncoder();
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 h
export const ADMIN_COOKIE_NAME = "tz_admin_session";

function requireSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET est requis (voir .env.example)");
  return s;
}

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let str = "";
  for (const b of arr) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64url: string): Uint8Array<ArrayBuffer> {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const bin = atob(b64 + pad);
  const bytes = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function createSessionToken(): Promise<string> {
  const secret = requireSecret();
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${expires}`;
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${toBase64Url(sig)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expires = Number(payload);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  try {
    const secret = requireSecret();
    const key = await getKey(secret);
    return crypto.subtle.verify("HMAC", key, fromBase64Url(sig), encoder.encode(payload));
  } catch {
    return false;
  }
}

/** Comparaison à temps constant pour éviter les attaques par timing sur le mot de passe. */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function checkAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD est requis (voir .env.example)");
  return safeCompare(input, expected);
}
