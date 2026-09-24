import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./client";
import { fetchWithRetry } from "./fetch-retry";

export async function createClient() {
  const cookieStore = await cookies();

  if (!isSupabaseConfigured()) {
    // Return server-side fallback
    const demoCookie = cookieStore.get("cdp_demo_user");
    const userEmail = demoCookie?.value || "alex.hunter@fintree.dev";

    return {
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "usr_demo_01",
              email: userEmail,
              user_metadata: { full_name: "Alex Hunter" },
            },
          },
          error: null,
        }),
        getClaims: async () => ({
          data: {
            claims: {
              sub: "usr_demo_01",
              email: userEmail,
              role: "authenticated",
            },
          },
          error: null,
        }),
        exchangeCodeForSession: async () => ({
          data: { session: {} },
          error: null,
        }),
      },
    } as any;
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { fetch: fetchWithRetry },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot always set cookies.
          }
        },
      },
    }
  );
}
