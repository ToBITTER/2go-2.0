"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { checkUsernameAvailability, loginUser, registerUser } from "@/lib/api";

function inputClassName() {
  return "w-full rounded-[14px] border border-white/10 bg-[#101820] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9] focus:border-[#6f8ea8]";
}

function submitClassName() {
  return "w-full rounded-[14px] bg-[#e7f0f7] px-4 py-3 text-sm font-semibold text-[#163042] transition hover:opacity-95";
}

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
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
        router.replace("/");
        router.refresh();
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
  const [pictureData, setPictureData] = useState<string>("");
  const [usernameState, setUsernameState] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const pictureInputRef = useRef<HTMLInputElement | null>(null);

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
    if (name === "username") {
      setUsernameState("idle");
    }
  }

  useEffect(() => {
    if (step !== 2) return;
    const username = form.username.trim();
    if (username.length < 3) {
      setUsernameState("idle");
      return;
    }

    const handle = window.setTimeout(() => {
      setUsernameState("checking");
      void (async () => {
        try {
          const payload = await checkUsernameAvailability(username);
          setUsernameState(payload.available ? "available" : "taken");
        } catch {
          setUsernameState("idle");
        }
      })();
    }, 350);

    return () => window.clearTimeout(handle);
  }, [form.username, step]);

  async function handlePictureUpload(file?: File) {
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setPictureData(dataUrl);
    } catch {
      setError("Unable to read the uploaded image.");
    }
  }

  function handleNext() {
    setError(null);

    const value = form[currentStep.field].trim();
    if (!value) {
      setError("Please fill this in to continue.");
      return;
    }

    if (currentStep.field === "username" && usernameState === "taken") {
      setError("That username is already taken.");
      return;
    }

    if (currentStep.field === "username" && usernameState === "checking") {
      setError("Checking availability, give us a second.");
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

        if (pictureData) {
          sessionStorage.setItem("2go_signup_picture", pictureData);
        }

        router.replace("/");
        router.refresh();
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
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#8fb7d5]">
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

      {step === 4 ? (
        <div className="space-y-3 rounded-[14px] border border-white/10 bg-[#0f161d] p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-white">Profile picture</p>
            <p className="text-sm text-[#b9c6d3]">Upload a photo or keep it blank for now.</p>
          </div>
          <input
            ref={pictureInputRef}
            type="file"
            accept="image/*"
            className="block w-full cursor-pointer text-sm text-[#dbe6ee] file:mr-4 file:rounded-full file:border-0 file:bg-[#e7f0f7] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#163042]"
            onChange={(event) => void handlePictureUpload(event.target.files?.[0])}
          />
          {pictureData ? (
            <div className="flex items-center gap-3">
              <img
                src={pictureData}
                alt="Profile preview"
                className="h-14 w-14 rounded-full object-cover ring-1 ring-white/10"
              />
              <button
                type="button"
                onClick={() => {
                  setPictureData("");
                  if (pictureInputRef.current) pictureInputRef.current.value = "";
                }}
                className="text-sm text-[#8fb7d5] underline underline-offset-4"
              >
                Remove photo
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 2 ? (
        <p className="text-sm text-[#b9c6d3]">
          {usernameState === "checking"
            ? "Checking availability..."
            : usernameState === "available"
              ? "Nice, that username is available."
              : usernameState === "taken"
                ? "That username is already taken."
                : "We'll check this as you type."}
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <div className="flex gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((current) => current - 1)}
            className="rounded-[14px] border border-white/10 bg-[#101820] px-4 py-3 text-sm font-semibold text-[#dbe6ee]"
          >
            Back
          </button>
        ) : null}
        <button
          disabled={pending || (step === 2 && usernameState === "taken")}
          type="button"
          onClick={handleNext}
          className={`${submitClassName()} flex-1`}
        >
          {pending ? "Creating..." : step < steps.length ? "Continue" : "Create account"}
        </button>
      </div>
    </div>
  );
}
