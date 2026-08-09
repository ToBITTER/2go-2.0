"use client";

import Image from "next/image";
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
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col justify-between overflow-hidden rounded-[22px] border border-white/10 bg-[#13202b] p-4 shadow-soft lg:flex">
          <div>
            <div className="flex items-center gap-3 rounded-[18px] bg-[#0d1720] px-3 py-3">
              <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-[14px] bg-[#e9f0f7]">
                <Image src="/brand/2go-mark.svg" alt="" width={44} height={44} className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">2go 2.0</p>
                <p className="text-lg font-semibold text-white">{title}</p>
              </div>
            </div>

            <nav className="mt-5 space-y-2">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-[16px] px-4 py-3 text-sm transition ${
                    pathname === item.href
                      ? "bg-[#2f7fb8] text-white"
                      : "text-[#c4d2de] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 rounded-[18px] bg-[#0d1720] p-4">
              <p className="text-sm font-semibold text-white">{subtitle}</p>
              <p className="mt-2 text-sm leading-6 text-[#b9c6d3]">
                Chat rooms, online people, stars, statuses, and social rank in one living network.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {utilityNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-[16px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-[#c4d2de]"
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ))}
            <button className="w-full rounded-[16px] bg-[#e7f0f7] px-4 py-3 text-sm font-semibold text-[#163042]">
              {actionLabel}
            </button>
          </div>
        </aside>

        <section className="flex-1">
          <div className="mb-4 flex items-center justify-between rounded-[18px] border border-white/10 bg-[#13202b] px-4 py-3 shadow-soft lg:hidden">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#8fb7d5]">2go 2.0</p>
              <p className="font-semibold text-white">{title}</p>
            </div>
            <button className="rounded-full bg-[#e7f0f7] px-4 py-2 text-sm font-semibold text-[#163042]">
              {actionLabel}
            </button>
          </div>
          {children}
          <nav className="sticky bottom-4 mt-6 grid grid-cols-5 gap-2 rounded-[18px] border border-white/10 bg-[#13202b]/95 p-2 shadow-soft lg:hidden">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`flex flex-col items-center gap-1 rounded-[14px] px-2 py-3 text-[11px] transition ${
                  pathname === item.href
                    ? "bg-[#2f7fb8] text-white"
                    : "text-[#c4d2de] hover:bg-white/5 hover:text-white"
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
