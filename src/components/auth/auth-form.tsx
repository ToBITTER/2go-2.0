"use client";

import { useMemo, useState, useTransition } from "react";
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
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
  });

  const steps = useMemo(
    () => [
      {
        title: "What should people call you?",
        field: "displayName" as const,
        type: "text",
        placeholder: "Display name",
        helper: "This is the name people will see first.",
      },
      {
        title: "Pick your username",
        field: "username" as const,
        type: "text",
        placeholder: "Username",
        helper: "Keep it short and easy to remember.",
      },
      {
        title: "Where should we reach you?",
        field: "email" as const,
        type: "email",
        placeholder: "Email",
        helper: "Used for login and account recovery.",
      },
      {
        title: "Set a password",
        field: "password" as const,
        type: "password",
        placeholder: "Password",
        helper: "Use at least 6 characters.",
      },
    ],
    [],
  );
  const currentStep = steps[step - 1];

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleNext() {
    setError(null);

    const value = form[currentStep.field].trim();
    if (!value) {
      setError("Please fill this in to continue.");
      return;
    }

    if (step < steps.length) {
      setStep((current) => current + 1);
      return;
    }

    startTransition(async () => {
      try {
        await registerUser({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          displayName: form.displayName.trim(),
        });
        router.push("/onboarding");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to create account");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {steps.map((_, index) => (
          <span
            key={index}
            className={`h-2 flex-1 rounded-full ${index + 1 <= step ? "bg-[#8fb7d5]" : "bg-white/10"}`}
          />
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">
          Step {step} of {steps.length}
        </p>
        <h2 className="text-2xl font-semibold text-white">{currentStep.title}</h2>
        <p className="text-sm leading-6 text-[#b9c6d3]">{currentStep.helper}</p>
      </div>

      <input
        className={inputClassName()}
        name={currentStep.field}
        type={currentStep.type}
        placeholder={currentStep.placeholder}
        value={form[currentStep.field]}
        onChange={(event) => updateField(currentStep.field, event.target.value)}
        autoComplete={currentStep.field}
        required
      />

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <div className="flex gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((current) => current - 1)}
            className="rounded-[16px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm font-semibold text-[#dbe6ee]"
          >
            Back
          </button>
        ) : null}
        <button disabled={pending} type="button" onClick={handleNext} className={`${submitClassName()} flex-1`}>
          {pending ? "Creating..." : step < steps.length ? "Continue" : "Create account"}
        </button>
      </div>
    </div>
  );
}
