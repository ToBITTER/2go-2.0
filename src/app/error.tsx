"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-radial-fog px-4 text-white">
      <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-soft">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">2go 2.0</p>
        <h1 className="mt-3 text-3xl font-semibold">Something hiccupped.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          We hit an unexpected error, but the app can recover without losing the flow.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={reset} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950">
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
