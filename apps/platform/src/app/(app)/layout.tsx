import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getDisplayName } from "@/lib/user";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";

  const name = getDisplayName(
    email,
    user.user_metadata as Record<string, unknown> | null,
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
