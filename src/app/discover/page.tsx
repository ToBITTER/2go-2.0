import { AppShell } from "@/components/layout/app-shell";
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
          <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-white">Communities</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {communities.map((community) => (
                <span key={community} className="rounded-full border border-white/10 bg-[#0d1720] px-3 py-2 text-sm text-[#dbe6ee]">
                  {community}
                </span>
              ))}
            </div>
          </section>
          <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-white">Trending</h2>
            <div className="mt-4 space-y-3">
              {trending.map((topic) => (
                <div key={topic} className="rounded-[18px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-[#dbe6ee]">
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
