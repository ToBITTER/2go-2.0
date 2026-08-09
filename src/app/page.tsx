import { ArrowRight, Flame, MessageCircle, Radio, Search, Shield, Star, Users, Zap } from "lucide-react";
import { Roadmap } from "@/components/roadmap";

const onlinePeople = [
  { name: "David", rank: "Professional", activity: "In Football room", status: "Online" },
  { name: "Tolu", rank: "Expert", activity: "Listening to music", status: "Online" },
  { name: "Jay", rank: "Amateur", activity: "Starting a new chat", status: "Online" },
  { name: "Praise", rank: "Master", activity: "Building in Tech room", status: "Away" },
];

const trending = [
  { title: "Champions League predictions", count: "189 people talking" },
  { title: "Who is still awake?", count: "127 people talking" },
  { title: "Best Nigerian artist right now?", count: "94 people talking" },
];

const communities = [
  "Football",
  "Music",
  "Tech",
  "Relationships",
  "Faith",
  "Gaming",
];

export default function Page() {
  return (
    <main className="min-h-screen bg-radial-fog text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pb-24 pt-6 md:px-8">
        <header className="glass-card sticky top-4 z-20 flex items-center justify-between rounded-3xl px-4 py-3 shadow-soft">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">2go 2.0</p>
            <h1 className="text-lg font-semibold">Who's around?</h1>
          </div>
          <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90">
            Sign in
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="glass-card rounded-[2rem] p-6 shadow-soft md:p-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-cyan-100/80">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1">Live social network</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Realtime presence</span>
              <span className="rounded-full border border-white/10 px-3 py-1">XP + ranks</span>
            </div>
            <div className="mt-8 max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/60">Good evening, Praise</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">
                The old 2go feeling, rebuilt for modern social discovery.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
                See who is online, jump into active rooms, find people with shared interests, and
                earn real progression for meaningful participation.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "People online", value: "247", icon: Users },
                { label: "Active rooms", value: "18", icon: Radio },
                { label: "Trending topics", value: "9", icon: Flame },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <item.icon className="h-5 w-5 text-cyan-300" />
                  <p className="mt-5 text-3xl font-semibold">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="grid gap-6">
            <div className="glass-card rounded-[2rem] p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Rank</h3>
                <Star className="h-5 w-5 text-amber-300" />
              </div>
              <p className="mt-4 text-2xl font-semibold">Professional</p>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div className="h-2 w-[74%] rounded-full bg-gradient-to-r from-cyan-300 to-sky-500" />
              </div>
              <p className="mt-3 text-sm text-slate-300">7,420 / 10,000 XP</p>
              <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-50">
                +20 XP for a helpful interaction
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-cyan-300" />
                <h3 className="font-semibold">Discover</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {communities.map((community) => (
                  <span key={community} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                    {community}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] bg-[#f7fafc] p-6 text-slate-900 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">People online</p>
                <h3 className="mt-2 text-2xl font-semibold">See who is active right now</h3>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                Explore <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
              {onlinePeople.map((person) => (
                <article key={person.name} className="min-w-[220px] rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">
                        {person.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{person.name}</p>
                        <p className="text-sm text-slate-500">{person.rank}</p>
                      </div>
                    </div>
                    <span className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />
                  </div>
                  <p className="mt-4 text-sm text-slate-600">{person.activity}</p>
                  <p className="mt-6 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {person.status}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-cyan-300" />
              <h3 className="font-semibold">Trending now</h3>
            </div>
            <div className="mt-5 space-y-3">
              {trending.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.count}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-sky-500/5 p-4">
              <div className="flex items-center gap-2 text-sm text-cyan-100">
                <Shield className="h-4 w-4" />
                Anti-abuse XP system
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Reward real conversation, healthy interactions, and community contribution.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            "Private messaging",
            "Public rooms",
            "Presence + statuses",
          ].map((item) => (
            <div key={item} className="glass-card rounded-[1.75rem] p-5">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-amber-300" />
                <p className="font-medium">{item}</p>
              </div>
            </div>
          ))}
        </section>

        <Roadmap />
      </section>
    </main>
  );
}
