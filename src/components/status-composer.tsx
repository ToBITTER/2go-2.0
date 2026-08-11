"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function StatusComposer() {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    const value = body.trim();
    if (!value) {
      setError("Write something first.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/statuses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ body: value }),
        });
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "Unable to post status");
        }

        setBody("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to post status");
      }
    });
  }

  return (
    <div className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">Status</p>
          <p className="mt-1 text-sm text-[#dbe6ee]">Say what&apos;s on your mind.</p>
        </div>
        <span className="text-xs text-[#b9c6d3]">{body.length}/120</span>
      </div>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Drop a quick status..."
        rows={3}
        className="mt-3 w-full resize-none rounded-[16px] border border-white/10 bg-[#13202b] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-[#b9c6d3]">Keep it short. Keep it real.</p>
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="rounded-full bg-[#e7f0f7] px-4 py-2 text-sm font-semibold text-[#163042] disabled:opacity-60"
        >
          {pending ? "Posting..." : "Post"}
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
