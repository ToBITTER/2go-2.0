import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";

const communities = ["Football", "Music", "Tech", "Gaming", "Faith", "Campus"];
const trending = [
  "Champions League predictions",
  "Best Nigerian artist right now?",
  "Who is still awake?",
];

export default function DiscoverPage() {
  return (
    <AppShell title="Discover" subtitle="Find people, rooms, and conversations that feel alive.">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Discovery"
          title="Find your people"
          description="Phase 0 defines the layout and navigation, so every later feature has a strong home from day one."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
            <h2 className="text-xl font-semibold">Communities</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {communities.map((community) => (
                <span key={community} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm">
                  {community}
                </span>
              ))}
            </div>
          </section>
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
            <h2 className="text-xl font-semibold">Trending</h2>
            <div className="mt-4 space-y-3">
              {trending.map((topic) => (
                <div key={topic} className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm">
                  {topic}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
