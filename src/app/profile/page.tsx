import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";

export default function ProfilePage() {
  return (
    <AppShell title="Profile" subtitle="Identity, rank, interests, and achievements live here.">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Profile"
          title="Your social identity"
          description="This is the foundation for the full profile, rank, and progression system."
        />
        <section className="rounded-[2rem] border border-olive-700/60 bg-panel p-6 shadow-soft">
          <p className="text-2xl font-semibold">Praise</p>
          <p className="mt-1 text-sm text-paper-muted">@tobitter - Professional</p>
          <p className="mt-4 text-sm leading-6 text-paper-muted">
            Building things - Backend - FinTech - AI
          </p>
        </section>
      </div>
    </AppShell>
  );
}
