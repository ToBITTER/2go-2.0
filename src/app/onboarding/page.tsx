import { AuthGate } from "@/components/auth/auth-gate";
import { AuthCard } from "@/components/auth/auth-card";
import { InterestsPicker } from "@/components/auth/interests-picker";

export default function OnboardingPage() {
  return (
    <AuthGate redirectTo="/">
      <main className="grid min-h-screen place-items-center bg-app px-4 py-8">
        <AuthCard
          title="Pick your vibe"
          subtitle="Choose your interests so 2go can surface the right rooms, people, and topics."
        >
          <InterestsPicker />
        </AuthCard>
      </main>
    </AuthGate>
  );
}
