import { createBrowserClient } from "@supabase/ssr";
import { fetchWithRetry } from "./fetch-retry";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key && !url.includes("your-supabase-project"));
}

export function createClient() {
  if (!isSupabaseConfigured()) {
    // Return graceful fallback interface for development & preview testing
    return {
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "usr_demo_01",
              email: "alex.hunter@fintree.dev",
              user_metadata: { full_name: "Alex Hunter" },
            },
          },
          error: null,
        }),
        getSession: async () => ({
          data: {
            session: {
              user: {
                id: "usr_demo_01",
                email: "alex.hunter@fintree.dev",
              },
            },
          },
          error: null,
        }),
        signInWithPassword: async ({ email }: { email: string }) => {
          if (typeof window !== "undefined") {
            localStorage.setItem("cdp_demo_auth", JSON.stringify({ email }));
          }
          return { data: { user: { email } }, error: null };
        },
        signUp: async ({ email }: { email: string }) => {
          if (typeof window !== "undefined") {
            localStorage.setItem("cdp_demo_auth", JSON.stringify({ email }));
          }
          return { data: { user: { email } }, error: null };
        },
        signOut: async () => {
          if (typeof window !== "undefined") {
            localStorage.removeItem("cdp_demo_auth");
          }
          return { error: null };
        },
      },
    } as any;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { global: { fetch: fetchWithRetry } },
  );
}
