import { isSupabaseConfigured } from "./client";
import { fetchWithRetry } from "./fetch-retry";

/**
 * Project-wide JWKS cache for local JWT verification.
 *
 * auth-js caches signing keys **per client instance**, and the server creates
 * a fresh Supabase client on every request (and middleware creates its own),
 * so every `getClaims()` would otherwise re-download
 * `.well-known/jwks.json` (~200ms) before it could verify the token. Caching
 * the key set here turns every verification after the first into a pure local
 * WebCrypto check (~1ms).
 *
 * Callers pass the result straight into `getClaims(undefined, { jwks })`;
 * auth-js still falls back to its own fetch path when a key id is missing
 * (e.g. after a signing-key rotation), so a stale cache can never break auth.
 * This function never rejects — on failure it resolves `undefined` and drops
 * the cached attempt so the next request retries.
 */
interface SharedJwks {
  keys: SharedJwk[];
}

/**
 * Structural twin of auth-js's `JWK` (that package is only a transitive
 * dependency, so we mirror its declaration exactly instead of importing it —
 * this keeps the object assignable to `getClaims`'s `{ keys: JWK[] }`).
 */
interface SharedJwk {
  kty: "RSA" | "EC" | "oct" | (string & {});
  key_ops: string[];
  alg?: string;
  kid?: string;
  [key: string]: any;
}

let inFlight: Promise<SharedJwks | undefined> | null = null;

async function loadJwks(): Promise<SharedJwks> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured");
  }

  const response = await fetchWithRetry(
    `${url}/auth/v1/.well-known/jwks.json`,
    { headers: { apikey: key } },
  );
  if (!response.ok) {
    throw new Error(`JWKS fetch failed with ${response.status}`);
  }

  const data = (await response.json()) as SharedJwks;
  if (!Array.isArray(data?.keys) || data.keys.length === 0) {
    throw new Error("JWKS response contained no keys");
  }
  return data;
}

export function getSharedJwks(): Promise<SharedJwks | undefined> {
  if (!isSupabaseConfigured()) {
    return Promise.resolve(undefined);
  }

  if (!inFlight) {
    inFlight = loadJwks().catch((error) => {
      inFlight = null; // never cache failures — the next request retries
      console.warn("[auth] shared JWKS fetch failed:", error);
      return undefined;
    });
  }
  return inFlight;
}
