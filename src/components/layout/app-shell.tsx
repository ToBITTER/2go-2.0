"use client";

import Link from "next/link";
import { mainNavigation, utilityNavigation } from "@/data/navigation";
import { ChevronRight, Star } from "lucide-react";
import { usePathname } from "next/navigation";

type AppShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actionLabel?: string;
};

export function AppShell({ title, subtitle, children, actionLabel = "Go live" }: AppShellProps) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-app text-paper">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-4 md:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col justify-between rounded-[2rem] border border-olive-700/60 bg-panel p-5 shadow-soft lg:flex">
          <div>
            <div className="flex items-center gap-3 border-b border-olive-700/50 pb-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-amber-500/30 bg-amber-400/15 text-amber-200">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">2go 2.0</p>
                <p className="text-lg font-semibold">{title}</p>
              </div>
            </div>

            <nav className="mt-5 space-y-2">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                    pathname === item.href
                      ? "bg-amber-400/15 text-amber-100"
                      : "text-paper-muted hover:bg-paper/5 hover:text-paper"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 rounded-3xl border border-olive-700/50 bg-black/20 p-4">
              <p className="text-sm font-medium text-paper">{subtitle}</p>
              <p className="mt-2 text-sm leading-6 text-paper-muted">
                Chat rooms, online people, stars, statuses, and social rank in one living network.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {utilityNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl border border-olive-700/50 bg-black/20 px-4 py-3 text-sm text-paper-muted"
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ))}
            <button className="w-full rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-stone-950">
              {actionLabel}
            </button>
          </div>
        </aside>

        <section className="flex-1">
          <div className="mb-4 flex items-center justify-between rounded-[1.5rem] border border-olive-700/60 bg-panel px-4 py-3 shadow-soft lg:hidden">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-amber-200/70">2go 2.0</p>
              <p className="font-semibold">{title}</p>
            </div>
            <button className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-stone-950">
              {actionLabel}
            </button>
          </div>
          {children}
          <nav className="sticky bottom-4 mt-6 grid grid-cols-5 gap-2 rounded-[1.5rem] border border-olive-700/60 bg-panel/95 p-2 shadow-soft backdrop-blur lg:hidden">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-[11px] transition ${
                  pathname === item.href
                    ? "bg-amber-400/15 text-amber-100"
                    : "text-paper-muted hover:bg-paper/5 hover:text-paper"
                }`}
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
