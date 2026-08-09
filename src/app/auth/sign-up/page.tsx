import Link from "next/link";
import { AuthGate } from "@/components/auth/auth-gate";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <AuthGate redirectTo="/onboarding">
      <main className="grid min-h-screen place-items-center bg-app px-4 py-8">
        <AuthCard
          title="Create your 2go"
          subtitle="Choose a username, set your display name, and start your social identity."
        >
          <SignUpForm />
          <p className="mt-5 text-sm text-[#b9c6d3]">
            Already have an account?{" "}
            <Link className="text-[#8fb7d5] underline underline-offset-4" href="/auth/sign-in">
              Sign in
            </Link>
          </p>
        </AuthCard>
      </main>
    </AuthGate>
  );
}
