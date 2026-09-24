/**
 * Retry policy for the Supabase failures that `postgrest-js` does not cover.
 *
 * `PGRST303 "JWT issued at future"` is raised by PostgREST when a token's
 * `iat` lands ahead of the validator's clock. Supabase's gateway mints the
 * short-lived JWT and PostgREST validates it, so this is a clock-sync issue
 * between two of their own services — it is intermittent, and it bites hardest
 * immediately after a fresh sign-in, which is exactly when the dashboard makes
 * its first queries. See supabase/supabase#49655 and PostgREST/postgrest#5196.
 *
 * `postgrest-js` only retries 503/520 on idempotent methods, so a 401 here
 * used to travel straight into `must()` in `dashboard.ts`, where one failed
 * query dropped the entire page into demo data.
 *
 * Deliberately complementary to the built-in policy (no overlapping codes, so
 * the two retry budgets never multiply):
 *   - built-in: 503/520 + network errors, idempotent methods
 *   - ours:     PGRST303 (any method) + 500/502/504, idempotent methods
 */

const MAX_ATTEMPTS = 4;
const BASE_DELAY_MS = 400;

/** Transient gateway/DB failures. 503 and 520 are excluded on purpose: postgrest-js already retries those. */
const RETRYABLE_STATUS_CODES = new Set([500, 502, 504]);

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const delayForAttempt = (attempt: number): number =>
  BASE_DELAY_MS * 2 ** (attempt - 1);

function resolveMethod(input: RequestInfo | URL, init?: RequestInit): string {
  const fromInit = init?.method;
  const fromRequest =
    typeof Request !== "undefined" && input instanceof Request
      ? input.method
      : undefined;
  return (fromInit ?? fromRequest ?? "GET").toUpperCase();
}

/**
 * Streams can only be consumed once, so they cannot be re-sent. postgrest-js
 * always passes a JSON string body, but auth-js and hand-rolled calls may not.
 */
function canResendBody(init?: RequestInit): boolean {
  const body = init?.body;
  if (body == null) return true;
  if (typeof body === "string") return true;
  if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) {
    return true;
  }
  if (typeof FormData !== "undefined" && body instanceof FormData) return true;
  if (typeof Blob !== "undefined" && body instanceof Blob) return true;
  if (
    typeof ArrayBuffer !== "undefined" &&
    (body instanceof ArrayBuffer || ArrayBuffer.isView(body))
  ) {
    return true;
  }
  return false;
}

/**
 * Detect PGRST303 without consuming the response the caller still needs, so we
 * read a clone. Returns false for any other 401 (expired token, bad key).
 */
async function isJwtIssuedAtFuture(response: Response): Promise<boolean> {
  if (response.status !== 401) return false;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return false;

  try {
    const body = (await response.clone().json()) as {
      code?: string;
      message?: string;
    };
    return (
      body?.code === "PGRST303" || /issued at future/i.test(body?.message ?? "")
    );
  } catch {
    return false;
  }
}

/**
 * Drop-in `fetch` for `createClient({ global: { fetch } })`.
 *
 * PGRST303 is raised during authentication, before the query reaches the
 * database, so retrying it is safe for every method — including upserts and
 * RPCs that mutate rows. Waiting between attempts also gives the two clocks
 * time to converge, which is what actually clears the error.
 */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const method = resolveMethod(input, init);
  const idempotent = method === "GET" || method === "HEAD" || method === "OPTIONS";
  const resendable = canResendBody(init);

  let attempt = 0;

  for (;;) {
    attempt += 1;

    let response: Response;
    try {
      response = await fetch(input, init);
    } catch (error) {
      // Only idempotent requests are safe to resend after an unknown outcome.
      if (!idempotent || !resendable || attempt >= MAX_ATTEMPTS) throw error;
      await sleep(delayForAttempt(attempt));
      continue;
    }

    const retryable =
      (await isJwtIssuedAtFuture(response)) ||
      (idempotent && RETRYABLE_STATUS_CODES.has(response.status));

    if (!retryable || !resendable || attempt >= MAX_ATTEMPTS) {
      return response;
    }

    // Drain before reusing the connection; the body is discarded either way.
    await response.body?.cancel().catch(() => undefined);
    await sleep(delayForAttempt(attempt));
  }
}
