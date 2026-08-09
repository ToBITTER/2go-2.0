import { ArrowRight, CircleDot, MessageSquareText, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { cookies } from "next/headers";
import { getUserFromSession } from "@/lib/store";
import Link from "next/link";

export default async function Page() {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);

  return (
    <AppShell title="Home" subtitle="Who's around?" actionLabel="Sign up" actionHref="/auth/sign-up">
      <section className="flex min-h-[calc(100vh-2rem)] flex-col gap-6 pb-16 pt-8">
        <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#13202b] p-6 shadow-soft md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1720] px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[#dbe6ee]">
              <CircleDot className="h-3 w-3 text-emerald-300" />
              People are here
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-white md:text-6xl">
              Remember when chat felt alive?
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#b9c6d3] md:text-lg">
              2go keeps it simple: see who&apos;s online, jump into a room, and move straight into the conversation.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <>
                  <Link
                    href="/rooms"
                    className="inline-flex items-center justify-center rounded-full bg-[#e7f0f7] px-6 py-3 text-sm font-semibold text-[#163042]"
                  >
                    Enter rooms
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#0d1720] px-6 py-3 text-sm font-semibold text-[#dbe6ee]"
                  >
                    Your profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/sign-up"
                    className="inline-flex items-center justify-center rounded-full bg-[#e7f0f7] px-6 py-3 text-sm font-semibold text-[#163042]"
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/auth/sign-in"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#0d1720] px-6 py-3 text-sm font-semibold text-[#dbe6ee]"
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-[24px] border border-white/10 bg-[#0d1720] p-5 shadow-soft">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8fb7d5]">Live now</p>
              <div className="mt-4 space-y-3">
                {[
                  "Someone from your circle",
                  "A room with new chatter",
                  "A friend who just came online",
                ].map((item) => (
                  <div key={item} className="rounded-[16px] border border-white/10 bg-[#13202b] px-4 py-3 text-sm text-[#dbe6ee]">
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { icon: Users, title: "People online", text: "See who&apos;s around right now." },
                { icon: MessageSquareText, title: "Statuses", text: "Drop a quick thought and move." },
                { icon: ArrowRight, title: "Quick entry", text: "Sign up or log in and roll in." },
              ].map((item) => (
                <article key={item.title} className="rounded-[18px] border border-white/10 bg-[#0d1720] p-5">
                  <item.icon className="h-5 w-5 text-[#8fb7d5]" />
                  <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#b9c6d3]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
