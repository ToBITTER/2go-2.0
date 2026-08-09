import Link from "next/link";
import { mainNavigation, utilityNavigation } from "@/data/navigation";
import { ChevronRight, Star } from "lucide-react";

type AppShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actionLabel?: string;
};

export function AppShell({ title, subtitle, children, actionLabel = "Go live" }: AppShellProps) {
  return (
    <main className="min-h-screen bg-radial-fog text-white">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-4 md:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-950">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/60">2go 2.0</p>
                <p className="text-lg font-semibold">{title}</p>
              </div>
            </div>

            <nav className="mt-8 space-y-2">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/30 p-4">
              <p className="text-sm font-medium">{subtitle}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Live presence, public rooms, private messages, and progression built into one social layer.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {utilityNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ))}
            <button className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">
              {actionLabel}
            </button>
          </div>
        </aside>

        <section className="flex-1">
          <div className="mb-4 flex items-center justify-between rounded-[1.75rem] border border-white/10 bg-white/5 px-4 py-3 shadow-soft lg:hidden">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/60">2go 2.0</p>
              <p className="font-semibold">{title}</p>
            </div>
            <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950">
              {actionLabel}
            </button>
          </div>
          {children}
          <nav className="sticky bottom-4 mt-6 grid grid-cols-5 gap-2 rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-2 shadow-soft backdrop-blur lg:hidden">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-[11px] text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
