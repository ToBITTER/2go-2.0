"use client";

import { useEffect, useState, useTransition } from "react";
import { getMe, logoutUser, updateProfile } from "@/lib/api";
import { useRouter } from "next/navigation";

export function ProfileEditor() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    picture: "",
  });
  const [user, setUser] = useState<Awaited<ReturnType<typeof getMe>>["user"] | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const payload = await getMe();
        setUser(payload.user);
        setForm({
          displayName: payload.user.displayName,
          bio: payload.user.bio,
          picture: payload.user.picture ?? "",
        });
      } catch {
        router.replace("/auth/sign-in");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        const payload = await updateProfile({
          displayName: form.displayName,
          bio: form.bio,
          picture: form.picture || undefined,
        });
        setUser(payload.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to update profile");
      }
    });
  }

  function signOut() {
    startTransition(async () => {
      await logoutUser();
      router.replace("/auth/sign-in");
    });
  }

  if (loading) {
    return (
      <div className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 text-[#b9c6d3]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-[18px] bg-[#e7f0f7] text-2xl font-semibold text-[#163042]">
            {user?.displayName?.[0] ?? "P"}
          </div>
          <div>
            <p className="text-xl font-semibold text-white">{user?.displayName ?? "Praise"}</p>
            <p className="text-sm text-[#8fb7d5]">@{user?.username ?? "tobitter"}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-[#b9c6d3]">
          <p><span className="text-white">Rank:</span> {user?.rank ?? "Novice"}</p>
          <p><span className="text-white">Bio:</span> {user?.bio ?? "New to 2go 2.0"}</p>
          <p><span className="text-white">Interests:</span> {(user?.interests ?? []).join(" · ") || "None selected"}</p>
        </div>

        <button
          type="button"
          onClick={signOut}
          className="mt-6 rounded-[16px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm font-semibold text-white"
        >
          Sign out
        </button>
      </section>

      <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-white">Edit profile</h2>
        <div className="mt-5 space-y-4">
          <input
            className="w-full rounded-[16px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
            value={form.displayName}
            onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))}
            placeholder="Display name"
          />
          <textarea
            className="min-h-28 w-full rounded-[16px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
            value={form.bio}
            onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
            placeholder="Bio"
          />
          <input
            className="w-full rounded-[16px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
            value={form.picture}
            onChange={(event) => setForm((current) => ({ ...current, picture: event.target.value }))}
            placeholder="Profile picture URL"
          />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button
            type="button"
            disabled={pending}
            onClick={submit}
            className="w-full rounded-[16px] bg-[#e7f0f7] px-4 py-3 text-sm font-semibold text-[#163042]"
          >
            {pending ? "Saving..." : "Save profile"}
          </button>
        </div>
      </section>
    </div>
  );
}
