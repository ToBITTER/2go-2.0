import Link from "next/link";
import { AuthGate } from "@/components/auth/auth-gate";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  return (
    <AuthGate redirectTo="/">
      <main className="grid min-h-screen place-items-center bg-app px-4 py-8">
        <AuthCard
          title="Welcome back"
          subtitle="Sign in and jump back into the rooms, chats, and people around you."
        >
          <SignInForm />
          <p className="mt-5 text-sm text-[#b9c6d3]">
            New here?{" "}
            <Link className="text-[#8fb7d5] underline underline-offset-4" href="/auth/sign-up">
              Create an account
            </Link>
          </p>
        </AuthCard>
      </main>
    </AuthGate>
  );
}
