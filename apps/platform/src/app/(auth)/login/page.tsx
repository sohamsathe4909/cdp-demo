import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-[100dvh] bg-[#f9fff6] text-[#0e0e0e] selection:bg-[#f8dc03] selection:text-[#0e0e0e]">
      <div className="grid min-h-[100dvh] lg:grid-cols-2">
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
              Career Discovery
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[1.05] tracking-[-0.04em]">
              Your career journey{" "}
              <span className="inline-block -rotate-1 bg-[#f8dc03] px-2 text-[#0e0e0e]">
                continues
              </span>{" "}
              here.
            </h1>
            <p className="mt-6 leading-7 text-white/60">
              Explore careers, understand the work and build a clearer picture
              of where you want to go.
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
        <section className="flex items-center justify-center px-4 py-6 sm:px-8 sm:py-12">
          <div className="w-full max-w-md animate-rise-in">
            <Link href="/" aria-label="Rarewise home" className="mb-7 inline-flex lg:hidden">
              <Image
                src="/rarewise-logo.png"
                alt="Rarewise"
                width={1067}
                height={215}
                priority
                className="h-8 w-auto"
              />
            </Link>
            <Link
              href="/"
              className="group mb-5 flex items-center gap-2 text-sm font-semibold text-[#5a5f58] transition hover:text-[#0e0e0e] sm:mb-8 lg:inline-flex"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to home
            </Link>

            <div className="rounded-2xl border-2 border-[#0e0e0e] bg-white p-5 shadow-[4px_4px_0_rgba(14,14,14,0.12)] transition-shadow duration-300 hover:shadow-[6px_6px_0_#f8dc03] sm:rounded-[28px] sm:p-9 sm:shadow-[6px_6px_0_rgba(14,14,14,0.12)]">
              <div className="mb-6 sm:mb-8">
                <span className="inline-block rounded-md bg-[#f8dc03] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0e0e0e]">
                  Welcome back
                </span>
                <h2 className="mt-4 text-[1.75rem] font-extrabold tracking-[-0.04em] sm:text-3xl">
                  Log in to Rarewise
                </h2>
                <span className="mt-3 block h-[3px] w-12 rotate-[-3deg] rounded bg-[#f8dc03]" />
                <p className="mt-3 text-sm leading-6 text-[#5a5f58]">
                  Continue your career discovery journey.
                </p>
              </div>
              <Suspense
                fallback={
                  <div className="flex h-48 items-center justify-center text-xs text-[#5a5f58]">
                    Loading form…
                  </div>
                }
              >
                <LoginForm />
              </Suspense>
              <p className="mt-6 text-center text-sm text-[#5a5f58]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-[#0e0e0e] underline decoration-[#f8dc03] decoration-2 underline-offset-4 transition hover:decoration-[#0e0e0e]"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
