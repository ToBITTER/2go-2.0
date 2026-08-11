"use client";

import { useState, useTransition } from "react";

type ReportButtonProps = {
  reportedUsername: string;
};

export function ReportButton({ reportedUsername }: ReportButtonProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function submitReport() {
    const reason = window.prompt("Why are you reporting this profile?");
    if (!reason?.trim()) return;
    const details = window.prompt("Add any extra details (optional)") ?? "";

    setMessage(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            reportedUsername,
            reason: reason.trim(),
            details: details.trim() || undefined,
          }),
        });
        if (!response.ok) {
          throw new Error("Unable to submit report");
        }
        setMessage("Report submitted");
      } catch {
        setMessage("Report failed");
      }
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={submitReport}
        disabled={pending}
        className="rounded-full border border-white/10 bg-[#0d1720] px-5 py-3 text-sm font-semibold text-[#dbe6ee] disabled:opacity-60"
      >
        {pending ? "Sending..." : "Report profile"}
      </button>
      {message ? <p className="text-xs text-[#8fb7d5]">{message}</p> : null}
    </div>
  );
}
