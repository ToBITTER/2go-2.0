"use client";

import { useEffect, useState, useTransition } from "react";
import { notFound, useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getRoom, sendRoomMessage, type RoomMessage, type RoomSummary } from "@/lib/api";

export default function RoomDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [room, setRoom] = useState<RoomSummary | null>(null);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [composer, setComposer] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      try {
        const payload = await getRoom(slug);
        setRoom(payload.room);
        setMessages(payload.messages);
      } catch {
        notFound();
      }
    })();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const handle = window.setInterval(async () => {
      try {
        const payload = await getRoom(slug);
        setRoom(payload.room);
        setMessages(payload.messages);
      } catch {
        return;
      }
    }, 6000);
    return () => window.clearInterval(handle);
  }, [slug]);

  function send() {
    if (!slug || !composer.trim()) return;
    const body = composer.trim();
    setComposer("");
    startTransition(async () => {
      const payload = await sendRoomMessage(slug, body);
      setMessages((current) => [...current, payload.message]);
    });
  }

  return (
    <AppShell title={room?.name ?? "Room"} subtitle={room?.description ?? "Live room"}>
      <div className="space-y-6">
        <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">{room?.category ?? "Room"}</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{room?.name ?? "Loading room..."}</h1>
          <p className="mt-3 text-sm text-[#b9c6d3]">{room?.description ?? "This room is waking up."}</p>
          <div className="mt-5 flex items-center gap-4 text-sm text-[#dbe6ee]">
            <span>{room?.members ?? 0} members</span>
            <span>{room?.online ?? 0} online</span>
          </div>
        </section>

        <section className="rounded-[20px] border border-white/10 bg-[#13202b] shadow-soft">
          <div className="max-h-[55vh] space-y-3 overflow-y-auto p-5">
            {messages.length ? (
              messages.map((message) => (
                <article key={message.id} className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4">
                  <p className="font-semibold text-white">{message.sender.displayName}</p>
                  <p className="text-xs text-[#8fb7d5]">
                    @{message.sender.username} · {message.sender.rank}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#dbe6ee]">{message.body}</p>
                </article>
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-white/10 bg-[#0d1720] p-6 text-sm text-[#b9c6d3]">
                No messages yet. Be the first person to say something.
              </div>
            )}
          </div>
          <div className="border-t border-white/10 p-4">
            <div className="flex gap-3">
              <input
                value={composer}
                onChange={(event) => setComposer(event.target.value)}
                placeholder="Say something..."
                className="min-w-0 flex-1 rounded-[14px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
              />
              <button
                type="button"
                disabled={pending}
                onClick={send}
                className="rounded-[14px] bg-[#e7f0f7] px-5 py-3 text-sm font-semibold text-[#163042]"
              >
                {pending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
