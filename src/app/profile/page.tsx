import { ProfileEditor } from "@/components/profile/profile-editor";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";

export default function ProfilePage() {
  return (
    <AppShell title="Profile" subtitle="Identity, rank, interests, and achievements live here.">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Profile"
          title="Your social identity"
          description="Edit your name, bio, and picture. This page is now wired to the API."
        />
        <ProfileEditor />
      </div>
    </AppShell>
  );
}
