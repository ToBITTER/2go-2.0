"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getInterests, updateOnboarding } from "@/lib/api";

const defaultInterests = [
  "Football",
  "Music",
  "Tech",
  "Gaming",
  "Movies",
  "Fashion",
  "Campus",
  "Business",
  "Relationships",
  "Faith",
  "Memes",
  "Anime",
  "Sports",
];

export function InterestsPicker() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [pending, startTransition] = useTransition();
  const interests = useMemo(() => defaultInterests, []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const payload = await getInterests();
        if (payload.interests.length) setSelected(payload.interests.slice(0, 3));
      } catch {
        // keep defaults
      }
    })();
  }, []);

  function toggle(interest: string) {
    setSelected((current) =>
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest],
    );
  }

  function onSubmit(formData: FormData) {
    setError(null);
    const nextBio = String(formData.get("bio") ?? bio).trim();

    startTransition(async () => {
      try {
        await updateOnboarding({ interests: selected, bio: nextBio });
        router.push("/profile");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to save onboarding");
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <div className="rounded-[16px] border border-white/10 bg-[#0f161d] p-4">
        <p className="text-sm text-[#b9c6d3]">Pick a few things you actually care about. You can change this later.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {interests.map((interest) => (
          <button
            key={interest}
            type="button"
            onClick={() => toggle(interest)}
            className={`rounded-[14px] border px-3 py-3 text-sm transition ${
              selected.includes(interest)
                ? "border-[#6f8ea8] bg-[#1a2833] text-white"
                : "border-white/10 bg-[#0f161d] text-[#dbe6ee]"
            }`}
          >
            {interest}
          </button>
        ))}
      </div>
      <textarea
        className="min-h-28 w-full rounded-[14px] border border-white/10 bg-[#0f161d] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9] focus:border-[#6f8ea8]"
        name="bio"
        placeholder="A short bio..."
        value={bio}
        onChange={(event) => setBio(event.target.value)}
      />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button
        disabled={pending}
        className="w-full rounded-[14px] bg-[#e7f0f7] px-4 py-3 text-sm font-semibold text-[#163042]"
      >
        {pending ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}
