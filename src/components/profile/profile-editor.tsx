"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getMe, logoutUser, updateProfile } from "@/lib/api";

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export function ProfileEditor() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
  });
  const [pictureData, setPictureData] = useState("");
  const [user, setUser] = useState<Awaited<ReturnType<typeof getMe>>["user"] | null>(null);
  const pictureInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const payload = await getMe();
        setUser(payload.user);
        setForm({
          displayName: payload.user.displayName,
          bio: payload.user.bio,
        });
        setPictureData(payload.user.picture ?? "");
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
          picture: pictureData || undefined,
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
    return <div className="rounded-[18px] border border-white/10 bg-[#121a22] p-6 text-[#b9c6d3]">Loading your profile...</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[18px] border border-white/10 bg-[#121a22] p-5 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-[16px] bg-[#0f161d] text-2xl font-semibold text-[#163042]">
            {pictureData ? (
              <img src={pictureData} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[#dbe6ee]">{user?.displayName?.[0] ?? "U"}</span>
            )}
          </div>
          <div>
            <p className="text-xl font-semibold text-white">{user?.displayName ?? "Your name"}</p>
            <p className="text-sm text-[#8fb7d5]">@{user?.username ?? "user"}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-[#b9c6d3]">
          <p>
            <span className="text-white">Rank:</span> {user?.rank ?? "Novice"}
          </p>
          <p>
            <span className="text-white">Bio:</span> {user?.bio ?? "A short line about you"}
          </p>
          <p>
            <span className="text-white">Interests:</span> {(user?.interests ?? []).join(" · ") || "None selected"}
          </p>
        </div>

        <button
          type="button"
          onClick={signOut}
          className="mt-6 rounded-[14px] border border-white/10 bg-[#0f161d] px-4 py-3 text-sm font-semibold text-white"
        >
          Sign out
        </button>
      </section>

      <section className="rounded-[18px] border border-white/10 bg-[#121a22] p-5 shadow-soft">
        <h2 className="text-2xl font-semibold text-white">Keep it current</h2>
        <div className="mt-5 space-y-4">
          <input
            className="w-full rounded-[14px] border border-white/10 bg-[#0f161d] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
            value={form.displayName}
            onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))}
            placeholder="Display name"
          />
          <textarea
            className="min-h-28 w-full rounded-[14px] border border-white/10 bg-[#0f161d] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
            value={form.bio}
            onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
            placeholder="A line about you"
          />
          <div className="space-y-3 rounded-[14px] border border-white/10 bg-[#0f161d] p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">Profile picture</p>
              <p className="text-sm text-[#b9c6d3]">Upload a photo or leave it blank.</p>
            </div>
            <input
              ref={pictureInputRef}
              type="file"
              accept="image/*"
              className="block w-full cursor-pointer text-sm text-[#dbe6ee] file:mr-4 file:rounded-full file:border-0 file:bg-[#e7f0f7] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#163042]"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  const dataUrl = await fileToDataUrl(file);
                  setPictureData(dataUrl);
                } catch {
                  setError("Unable to read the uploaded image.");
                }
              }}
            />
            {pictureData ? (
              <div className="flex items-center gap-3">
                <img src={pictureData} alt="Profile preview" className="h-14 w-14 rounded-full object-cover ring-1 ring-white/10" />
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
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button
            type="button"
            disabled={pending}
            onClick={submit}
            className="w-full rounded-[14px] bg-[#e7f0f7] px-4 py-3 text-sm font-semibold text-[#163042]"
          >
            {pending ? "Saving..." : "Save profile"}
          </button>
        </div>
      </section>
    </div>
  );
}
