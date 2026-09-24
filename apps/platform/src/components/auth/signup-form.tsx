"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2, User } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      setSuccess("Account created! Redirecting to your dashboard…");
      if (typeof window !== "undefined") {
        document.cookie = `cdp_demo_user=${email}; path=/`;
      }
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.");
      setLoading(false);
    }
  }

  const fieldClass =
    "peer h-12 rounded-xl border-2 border-[#0e0e0e]/10 bg-white pl-11 pr-4 text-sm text-[#0e0e0e] transition placeholder:text-[#9aa19b] focus-visible:border-[#0e0e0e] focus-visible:ring-4 focus-visible:ring-[#f8dc03]/70";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a5f58]">
          Full name
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5a5f58] transition-colors peer-focus:text-[#0e0e0e]" />
          <Input
            id="fullName"
            type="text"
            placeholder="Alex Hunter"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
            className={fieldClass}
          />
        </div>
      </div>

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
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a5f58]">
          Password <span className="normal-case font-normal text-[#5a5f58]">(min. 8 chars)</span>
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5a5f58] transition-colors peer-focus:text-[#0e0e0e]" />
          <Input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a5f58]">
          Confirm password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5a5f58] transition-colors peer-focus:text-[#0e0e0e]" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className={fieldClass}
          />
        </div>
      </div>

      {error && (
        <div className="animate-shake flex items-center gap-2.5 rounded-xl border-2 border-[#0e0e0e] bg-[#fff1f1] p-3 text-xs font-medium text-[#b3261e]">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#b3261e]" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="animate-rise-in flex items-center gap-2.5 rounded-xl border-2 border-[#0e0e0e] bg-[#f8dc03] p-3 text-xs font-semibold text-[#0e0e0e]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0e0e0e]" />
          <span>{success}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-[#0e0e0e] text-sm font-semibold text-white shadow-[3px_3px_0_#f8dc03] transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-[5px_5px_0_#f8dc03] active:translate-y-0 active:shadow-[2px_2px_0_#f8dc03]"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Creating account…
          </>
        ) : (
          <>
            Create account
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
