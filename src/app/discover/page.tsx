import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";

const communities = [
  { name: "Football", note: "Busy right now" },
  { name: "Music", note: "Fresh talk" },
  { name: "Tech", note: "People online" },
  { name: "Gaming", note: "Open rooms" },
  { name: "Campus", note: "Always active" },
  { name: "Faith", note: "Quiet chat" },
];
const activity = [
  "Someone just joined a room.",
  "A profile got a new status.",
  "A conversation is still moving.",
];

export default function DiscoverPage() {
  return (
    <AppShell title="Discover" subtitle="Find people, rooms, and conversations that feel alive.">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Discovery"
          title="Find your people"
          description="Scroll, tap, and stumble on something good."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-white">Communities</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {communities.map((community) => (
                <Link
                  key={community.name}
                  href="/rooms"
                  className="rounded-[18px] border border-white/10 bg-[#0d1720] px-4 py-3 transition hover:border-[#8fb7d5]/40 hover:bg-[#111c26]"
                >
                  <p className="text-sm font-semibold text-white">{community.name}</p>
                  <p className="mt-1 text-xs text-[#b9c6d3]">{community.note}</p>
                </Link>
              ))}
            </div>
          </section>
          <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-white">Live activity</h2>
            <div className="mt-4 space-y-3">
              {activity.map((item) => (
                <div key={item} className="rounded-[18px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-[#dbe6ee]">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
