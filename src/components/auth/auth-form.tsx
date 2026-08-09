"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api";

function inputClassName() {
  return "w-full rounded-[16px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9] focus:border-[#2f7fb8]";
}

function submitClassName() {
  return "w-full rounded-[16px] bg-[#e7f0f7] px-4 py-3 text-sm font-semibold text-[#163042] transition hover:opacity-95";
}

export function SignInForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      try {
        await loginUser({ email, password });
        router.push("/onboarding");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to sign in");
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <input className={inputClassName()} name="email" type="email" placeholder="Email" required />
      <input className={inputClassName()} name="password" type="password" placeholder="Password" required />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button disabled={pending} className={submitClassName()} type="submit">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    const username = String(formData.get("username") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const displayName = String(formData.get("displayName") ?? "");

    startTransition(async () => {
      try {
        await registerUser({ username, email, password, displayName });
        router.push("/onboarding");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to create account");
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <input className={inputClassName()} name="displayName" placeholder="Display name" required />
      <input className={inputClassName()} name="username" placeholder="Username" required />
      <input className={inputClassName()} name="email" type="email" placeholder="Email" required />
      <input className={inputClassName()} name="password" type="password" placeholder="Password" required />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button disabled={pending} className={submitClassName()} type="submit">
        {pending ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
