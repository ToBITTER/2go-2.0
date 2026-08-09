import { ProfileEditor } from "@/components/profile/profile-editor";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";

export default function ProfilePage() {
  return (
    <AppShell title="Profile" subtitle="Your corner of 2go.">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Profile"
          title="Your vibe"
          description="Update your name, bio, and picture."
        />
        <ProfileEditor />
      </div>
    </AppShell>
  );
}
