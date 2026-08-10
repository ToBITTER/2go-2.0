"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mainNavigation, utilityNavigation, type NavigationItem } from "@/data/navigation";
import { ChevronRight, LogOut, Star, UserCircle2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getMe, logoutUser, type AuthUser } from "@/lib/api";

type AppShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
};

export function AppShell({
  title,
  subtitle,
  children,
  actionLabel = "Go live",
  actionHref = "/auth/sign-in",
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const utilityItems: NavigationItem[] = utilityNavigation;

  useEffect(() => {
    void (async () => {
      try {
        const payload = await getMe();
        setUser(payload.user);
      } catch {
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (user) return;
    router.replace("/auth/sign-in");
  }, [authReady, router, user]);

  if (!authReady || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-app px-4 text-[#dbe6ee]">
        <p className="text-sm uppercase tracking-[0.35em] text-[#8fb7d5]">Loading...</p>
      </main>
    );
  }

  function handleLogout() {
    void (async () => {
      try {
        await logoutUser();
        setUser(null);
      } catch {
        setUser(null);
      }
    })();
  }

  return (
    <main className="min-h-screen bg-app text-paper">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-3 py-3 sm:px-4 md:px-6 lg:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-80 flex-col justify-between overflow-hidden rounded-[22px] border border-white/10 bg-[#13202b] p-4 shadow-soft lg:flex">
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
            {authReady && user ? (
              <div className="rounded-[16px] border border-white/10 bg-[#0d1720] p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#e7f0f7] text-[#163042]">
                    {user.displayName?.[0] ?? "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.displayName}</p>
                    <p className="text-xs text-[#8fb7d5]">@{user.username}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-[#b9c6d3]">
                  <span>{user.rank}</span>
                  <span>{user.interests.length} interests</span>
                </div>
              </div>
            ) : null}
            {utilityItems.map((item) => (
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
            {authReady && user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-[16px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm font-semibold text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            ) : (
              <Link
                href={actionHref}
                className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#e7f0f7] px-4 py-3 text-sm font-semibold text-[#163042]"
              >
                <UserCircle2 className="h-4 w-4" />
                {actionLabel}
              </Link>
            )}
          </div>
        </aside>

        <section className="min-w-0 flex-1 pb-20 lg:pb-0">
          <div className="mb-4 flex items-center justify-between rounded-[18px] border border-white/10 bg-[#13202b] px-4 py-3 shadow-soft lg:hidden">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#8fb7d5]">2go 2.0</p>
              <p className="font-semibold text-white">{title}</p>
            </div>
            {authReady && user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-[#e7f0f7] px-4 py-2 text-sm font-semibold text-[#163042]"
              >
                Sign out
              </button>
            ) : authReady ? (
              <Link href={actionHref} className="rounded-full bg-[#e7f0f7] px-4 py-2 text-sm font-semibold text-[#163042]">
                {actionLabel}
              </Link>
            ) : (
              <span className="rounded-full bg-[#e7f0f7] px-4 py-2 text-sm font-semibold text-[#163042] opacity-70">
                Loading...
              </span>
            )}
          </div>
          {children}
          <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-2 rounded-[18px] border border-white/10 bg-[#13202b]/95 p-2 shadow-soft backdrop-blur lg:hidden sm:inset-x-4">
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
                <span className="leading-none">{item.label}</span>
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
