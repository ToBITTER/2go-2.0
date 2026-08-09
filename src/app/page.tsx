import { ArrowRight, Clock3, Flame, MessageSquareText, Radio, Search, Shield, Star, UserCircle2, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Roadmap } from "@/components/roadmap";
import { EmptyState, Pill, StatCard } from "@/components/ui";
import { homeStats, onlinePeople, roomCards, statusBites, trendingTopics } from "@/data/home";
import { site } from "@/lib/site";

export default function Page() {
  return (
    <AppShell title="Home" subtitle="Who's around?">
      <section className="flex flex-col gap-6 pb-24">
        <div className="rounded-[2rem] border border-olive-700/60 bg-panel p-5 shadow-soft md:p-7">
          <div className="flex items-center justify-between border-b border-olive-700/40 pb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-amber-200/70">2go social</p>
              <h2 className="mt-2 text-2xl font-semibold">Who is online right now?</h2>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs text-amber-100 md:flex">
              <Clock3 className="h-4 w-4" />
              Live now
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-paper-muted md:text-base">
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
          <section className="rounded-[2rem] border border-olive-700/60 bg-panel p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-amber-200/70">People online</p>
                <h3 className="mt-2 text-xl font-semibold">The room is alive</h3>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
                See all <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {onlinePeople.map((person) => (
                <article
                  key={person.name}
                  className="flex items-center justify-between rounded-2xl border border-olive-700/50 bg-black/20 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-100">
                      {person.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{person.name}</p>
                      <p className="text-xs text-paper-muted">
                        {person.activity} · {person.rank}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-emerald-300">{person.status}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-paper-muted">{person.rank}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-olive-700/60 bg-panel p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-200" />
              <h3 className="text-xl font-semibold">Trending</h3>
            </div>
            <div className="mt-5 space-y-3">
              {trendingTopics.map((topic) => (
                <article key={topic.title} className="rounded-2xl border border-olive-700/50 bg-black/20 p-4">
                  <p className="font-medium">{topic.title}</p>
                  <p className="mt-1 text-sm text-paper-muted">{topic.count}</p>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
              <div className="flex items-center gap-2 text-sm text-amber-100">
                <Shield className="h-4 w-4" />
                XP stays server-side only
              </div>
              <p className="mt-2 text-sm text-paper-muted">
                Reward real conversation, not noise. The old social feel stays, the abuse does not.
              </p>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-olive-700/60 bg-panel p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-amber-200" />
              <h3 className="text-xl font-semibold">Fresh statuses</h3>
            </div>
            <div className="mt-5 space-y-3">
              {statusBites.map((status) => (
                <article key={status.name} className="rounded-2xl border border-olive-700/50 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">@{status.name}</p>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-amber-200">{status.tag}</span>
                  </div>
                  <p className="mt-2 text-sm text-paper-muted">{status.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-olive-700/60 bg-panel p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-amber-200/70">Rooms</p>
                <h3 className="mt-2 text-xl font-semibold">Classic chat rooms</h3>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
                Enter room <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {roomCards.map((room) => (
                <article key={room.name} className="rounded-2xl border border-olive-700/50 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{room.name}</p>
                    <Star className="h-4 w-4 text-amber-200" />
                  </div>
                  <p className="mt-2 text-sm text-paper-muted">{room.members}</p>
                  <p className="text-sm text-emerald-300">{room.online}</p>
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
            <div key={item.title} className="rounded-[1.5rem] border border-olive-700/60 bg-panel p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-amber-200" />
                <p className="font-medium">{item.title}</p>
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
