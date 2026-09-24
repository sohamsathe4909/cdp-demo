import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getSharedJwks } from "@/lib/supabase/jwks";
import { getDisplayName } from "@/lib/user";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  // Verify the JWT locally (WebCrypto + shared JWKS cache) instead of
  // getUser()'s auth-server round-trip; middleware runs this same check.
  const { data } = await supabase.auth.getClaims(undefined, {
    jwks: await getSharedJwks(),
  });
  const claims = data?.claims;

  if (!claims) {
    redirect("/login");
  }

  const email = claims.email ?? "";

  const name = getDisplayName(
    email,
    claims.user_metadata
      ? (claims.user_metadata as Record<string, unknown>)
      : null,
  );

  return (
    <AppShell
      user={{
        email,
        name,
      }}
    >
      {children}
    </AppShell>
  );
}
