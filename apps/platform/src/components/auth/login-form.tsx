"use client";

import React, { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
      // push alone fetches /dashboard fresh with the new session cookies —
      // a refresh() right after it would run the whole server render twice.
      router.push(redirectTo);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  function handleDemoLogin() {
    setLoading(true);
    if (typeof window !== "undefined") {
      document.cookie = "cdp_demo_user=alex.hunter@fintree.dev; path=/";
    }
    const redirectTo = searchParams.get("redirectTo") || "/dashboard";
    setTimeout(() => {
      router.push(redirectTo);
      setLoading(false);
    }, 350);
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a5f58]">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5a5f58] transition-colors peer-focus:text-[#0e0e0e]" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="peer h-12 rounded-xl border-2 border-[#0e0e0e]/10 bg-white pl-11 pr-4 text-sm text-[#0e0e0e] transition placeholder:text-[#9aa19b] focus-visible:border-[#0e0e0e] focus-visible:ring-4 focus-visible:ring-[#f8dc03]/70"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a5f58]">
              Password
            </label>
            <a href="#" className="text-xs font-semibold text-[#0e0e0e] underline decoration-[#f8dc03] decoration-2 underline-offset-4 transition hover:decoration-[#0e0e0e]">
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5a5f58] transition-colors peer-focus:text-[#0e0e0e]" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="peer h-12 rounded-xl border-2 border-[#0e0e0e]/10 bg-white pl-11 pr-4 text-sm text-[#0e0e0e] transition placeholder:text-[#9aa19b] focus-visible:border-[#0e0e0e] focus-visible:ring-4 focus-visible:ring-[#f8dc03]/70"
            />
          </div>
        </div>

        {error && (
          <div className="animate-shake flex items-center gap-2.5 rounded-xl border-2 border-[#0e0e0e] bg-[#fff1f1] p-3 text-xs font-medium text-[#b3261e]">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#b3261e]" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#0e0e0e] text-sm font-semibold text-white shadow-[3px_3px_0_#f8dc03] transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-[5px_5px_0_#f8dc03] active:translate-y-0 active:shadow-[2px_2px_0_#f8dc03]"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {!isSupabaseConfigured() && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#5a5f58]">
                or
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#0e0e0e] bg-white px-5 py-3 text-sm font-semibold text-[#0e0e0e] transition hover:bg-[#f8dc03] active:scale-[0.98]"
          >
            Explore as Demo User
          </button>
        </>
      )}
    </div>
  );
}
