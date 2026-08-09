import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";

const metrics = [
  { label: "Users online", value: "247" },
  { label: "Messages/min", value: "1,204" },
  { label: "Active rooms", value: "18" },
];

export default function AdminPage() {
  return (
    <AppShell title="Admin" subtitle="Moderation and system health sit apart from the main social experience.">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Operations"
          title="Admin foundation"
          description="Phase 0 includes a separate admin route so ops can stay isolated from the main product."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-[18px] border border-white/10 bg-[#13202b] p-5 shadow-soft">
              <p className="text-sm text-[#b9c6d3]">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
