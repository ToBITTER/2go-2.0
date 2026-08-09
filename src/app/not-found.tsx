import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-radial-fog px-4 text-white">
      <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-soft">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">2go 2.0</p>
        <h1 className="mt-3 text-3xl font-semibold">This room is empty.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          The page you tried to open does not exist yet. Let’s take you back to the living network.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
