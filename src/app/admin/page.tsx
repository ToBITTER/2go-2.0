import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { getSystemStats } from "@/lib/store";

const statLabels = [
  ["users", "Users"],
  ["sessions", "Active sessions"],
  ["conversations", "Conversations"],
  ["rooms", "Rooms"],
  ["messages", "DM messages"],
  ["roomMessages", "Room messages"],
  ["statuses", "Statuses"],
  ["roomMemberships", "Room joins"],
] as const;

export default async function AdminPage() {
  const stats = process.env.DATABASE_URL ? await getSystemStats().catch(() => null) : null;

  return (
    <AppShell title="Admin" subtitle="System tools live apart from the main social experience.">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Operations"
          title="Operations"
          description="Real database visibility for maintenance and moderation."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statLabels.map(([key, label]) => (
            <div key={key} className="rounded-[18px] border border-white/10 bg-[#13202b] p-5 shadow-soft">
              <p className="text-sm text-[#b9c6d3]">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stats ? stats[key] : "—"}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Phase 6 focus</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Search and discovery hardening", "Moderation and audit visibility", "Production scale and performance cleanup"].map(
              (item) => (
                <div key={item} className="rounded-[16px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-[#dbe6ee]">
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
