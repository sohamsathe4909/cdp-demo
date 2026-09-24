/**
 * Route-group loading shell: shown the instant navigation enters (app)
 * routes, while the server component finishes its Supabase reads. Without
 * it the previous page (and its spinner) stays visible until the full
 * dashboard render resolves.
 */
export default function Loading() {
  const card = "animate-pulse rounded-2xl border border-black/10 bg-white/60";

  return (
    <div
      className="mx-auto max-w-6xl px-5 py-8 sm:px-7 lg:px-10 lg:py-10"
      role="status"
    >
      <span className="sr-only">Loading…</span>

      {/* Greeting */}
      <div className="h-9 w-56 animate-pulse rounded-lg bg-[#0e0e0e]/10" />
      <div className="mt-3 h-4 w-72 animate-pulse rounded bg-[#0e0e0e]/10" />

      {/* 30-day strip */}
      <div className={`mt-7 h-28 ${card}`} />

      {/* Current module + live Expinar */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_370px]">
        <div className={`h-56 ${card}`} />
        <div className={`h-56 ${card}`} />
      </div>

      {/* Tracks + badges + career-fit */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_370px]">
        <div className={`h-72 ${card}`} />
        <div className="flex flex-col gap-6">
          <div className={`h-40 ${card}`} />
          <div className={`h-40 ${card}`} />
        </div>
      </div>

      {/* Activity charts + streak */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_370px]">
        <div className={`h-72 ${card}`} />
        <div className={`h-72 ${card}`} />
      </div>
    </div>
  );
}
