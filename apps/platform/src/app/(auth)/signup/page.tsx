import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#f9fff6] text-[#0e0e0e] selection:bg-[#f8dc03] selection:text-[#0e0e0e]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ----------------------------------------------------------
            Brand panel — same ink/gold/aqua as the landing header
        ---------------------------------------------------------- */}
        <section className="relative hidden overflow-hidden bg-[#0e0e0e] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          {/* Floating accents */}
          <span className="animate-float-y absolute -right-16 top-20 h-56 w-56 rounded-full bg-[#1ed2f4]/25" />
          <span className="animate-float-y absolute right-28 top-1/2 h-24 w-24 rounded-2xl bg-[#f8dc03] [animation-delay:1.4s]" />
          <span className="animate-float-y absolute -left-10 bottom-24 h-32 w-32 rounded-full border-[6px] border-white/10 [animation-delay:0.7s]" />

          <Link
            href="/"
            aria-label="Rarewise home"
            className="relative inline-flex w-fit items-center transition-opacity hover:opacity-75"
          >
            {/* Dark artwork flipped white to read on the black panel */}
            <Image
              src="/rarewise-logo.png"
              alt="Rarewise"
              width={1067}
              height={215}
              priority
              className="h-12 w-auto brightness-0 invert"
            />
          </Link>

          <div className="relative max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f8dc03]">
              Start exploring
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[1.05] tracking-[-0.04em]">
              Don&apos;t choose a career without{" "}
              <span className="inline-block -rotate-1 bg-[#f8dc03] px-2 text-[#0e0e0e]">
                experiencing
              </span>{" "}
              it first.
            </h1>
            <p className="mt-6 leading-7 text-white/60">
              Build context, explore different paths and discover the kind of
              work that actually interests you.
            </p>
            <span className="mt-7 block h-[3px] w-16 rotate-[-3deg] rounded bg-[#1ed2f4]" />
          </div>

          <p className="relative text-xs text-white/30">
            Rarewise · Career Discovery Platform by Fintree
          </p>
        </section>

        {/* ----------------------------------------------------------
            Form
        ---------------------------------------------------------- */}
        <section className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md animate-rise-in">
            <Link
              href="/"
              className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#5a5f58] transition hover:text-[#0e0e0e]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to home
            </Link>

            <div className="rounded-[28px] border-2 border-[#0e0e0e] bg-white p-7 shadow-[6px_6px_0_rgba(14,14,14,0.12)] transition-shadow duration-300 hover:shadow-[6px_6px_0_#f8dc03] sm:p-9">
              <div className="mb-8">
                <span className="inline-block rounded-md bg-[#f8dc03] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0e0e0e]">
                  Create account
                </span>
                <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em]">
                  Start your journey
                </h2>
                <span className="mt-3 block h-[3px] w-12 rotate-[-3deg] rounded bg-[#f8dc03]" />
                <p className="mt-3 text-sm leading-6 text-[#5a5f58]">
                  Create an account and start discovering where you fit.
                </p>
              </div>
              <SignupForm />
              <p className="mt-6 text-center text-sm text-[#5a5f58]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#0e0e0e] underline decoration-[#f8dc03] decoration-2 underline-offset-4 transition hover:decoration-[#0e0e0e]"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
