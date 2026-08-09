import { ArrowRight, Clock3, Flame, MessageSquareText, Radio, Search, Shield, Star, UserCircle2, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Roadmap } from "@/components/roadmap";
import { EmptyState, Pill, StatCard } from "@/components/ui";
import { homeStats, onlinePeople, roomCards, statusBites, trendingTopics } from "@/data/home";
import { site } from "@/lib/site";
import Link from "next/link";

export default function Page() {
  return (
    <AppShell title="Home" subtitle="Who's around?" actionLabel="Sign up" actionHref="/auth/sign-up">
      <section className="flex flex-col gap-6 pb-24">
        <div className="rounded-[20px] border border-white/10 bg-[#13202b] p-5 shadow-soft md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#8fb7d5]">Welcome to 2go</p>
              <h1 className="mt-2 max-w-xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                A modern social room with the old-school energy people actually miss.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#b9c6d3] md:text-base">
                Create your account, pick your interests, and jump into live rooms, private chats, and status updates.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center justify-center rounded-full bg-[#e7f0f7] px-5 py-3 text-sm font-semibold text-[#163042]"
                >
                  Create account
                </Link>
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#0d1720] px-5 py-3 text-sm font-semibold text-[#dbe6ee]"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">Phase 1</p>
              <p className="mt-2 text-xl font-semibold text-white">Signup and onboarding</p>
              <p className="mt-3 text-sm leading-6 text-[#b9c6d3]">
                This is the entry point for new users. The CTA now goes straight to the sign-up form.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-[#13202b] p-5 shadow-soft md:p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#8fb7d5]">2go social</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Who is online right now?</h2>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-[#0d1720] px-3 py-2 text-xs text-[#c6d4df] md:flex">
              <Clock3 className="h-4 w-4" />
              Live now
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#b9c6d3] md:text-base">
            {site.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Pill>Online people</Pill>
            <Pill tone="soft">Public rooms</Pill>
            <Pill tone="soft">Private chats</Pill>
            <Pill tone="soft">Status updates</Pill>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {homeStats.map((item) => (
              <StatCard key={item.label} icon={item.icon} value={item.value} label={item.label} />
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#8fb7d5]">People online</p>
                <h3 className="mt-2 text-xl font-semibold text-white">The room is alive</h3>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1720] px-4 py-2 text-sm text-[#dbe6ee]">
                See all <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {onlinePeople.map((person) => (
                <article
                  key={person.name}
                  className="flex items-center justify-between rounded-[18px] border border-white/10 bg-[#0d1720] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-[14px] border border-white/10 bg-[#e7f0f7] text-[#163042]">
                      {person.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{person.name}</p>
                      <p className="text-xs text-[#b9c6d3]">
                        {person.activity} - {person.rank}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#7fd18a]">{person.status}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#b9c6d3]">{person.rank}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-[#8fb7d5]" />
              <h3 className="text-xl font-semibold text-white">Trending</h3>
            </div>
            <div className="mt-5 space-y-3">
              {trendingTopics.map((topic) => (
                <article key={topic.title} className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4">
                  <p className="font-medium text-white">{topic.title}</p>
                  <p className="mt-1 text-sm text-[#b9c6d3]">{topic.count}</p>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-[18px] border border-white/10 bg-[#0d1720] p-4">
              <div className="flex items-center gap-2 text-sm text-[#dbe6ee]">
                <Shield className="h-4 w-4" />
                XP stays server-side only
              </div>
              <p className="mt-2 text-sm text-[#b9c6d3]">
                Reward real conversation, not noise. The old social feel stays, the abuse does not.
              </p>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-[#8fb7d5]" />
              <h3 className="text-xl font-semibold text-white">Fresh statuses</h3>
            </div>
            <div className="mt-5 space-y-3">
              {statusBites.map((status) => (
                <article key={status.name} className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">@{status.name}</p>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#8fb7d5]">{status.tag}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#b9c6d3]">{status.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#8fb7d5]">Rooms</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Classic chat rooms</h3>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1720] px-4 py-2 text-sm text-[#dbe6ee]">
                Enter room <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {roomCards.map((room) => (
                <article key={room.name} className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{room.name}</p>
                    <Star className="h-4 w-4 text-[#8fb7d5]" />
                  </div>
                  <p className="mt-2 text-sm text-[#b9c6d3]">{room.members}</p>
                  <p className="text-sm text-[#7fd18a]">{room.online}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Private messages", icon: UserCircle2 },
            { title: "Presence + online", icon: Radio },
            { title: "Search + discovery", icon: Search },
          ].map((item) => (
            <div key={item.title} className="rounded-[18px] border border-white/10 bg-[#13202b] p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-[#8fb7d5]" />
                <p className="font-medium text-white">{item.title}</p>
              </div>
            </div>
          ))}
        </section>

        <Roadmap />

        <EmptyState
          title="It's quiet here."
          description="This is the kind of empty state 2go used to have, but dressed with a proper modern system behind it."
        />
      </section>
    </AppShell>
  );
}
