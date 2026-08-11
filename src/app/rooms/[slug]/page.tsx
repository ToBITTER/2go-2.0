"use client";

import { useEffect, useState, useTransition } from "react";
import { notFound, useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getRoom, joinRoom, sendRoomMessage, type RoomMessage, type RoomSummary } from "@/lib/api";

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

  function joinTheRoom() {
    if (!slug) return;
    startTransition(async () => {
      await joinRoom(slug);
      const payload = await getRoom(slug);
      setRoom(payload.room);
      setMessages(payload.messages);
    });
  }

  function send() {
    if (!slug || !composer.trim() || !room?.joined) return;
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
        <section className="rounded-[24px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">{room?.category ?? "Room"}</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{room?.name ?? "Loading room..."}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#b9c6d3]">{room?.description ?? "This room is waking up."}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-[#0d1720] px-3 py-2 text-xs text-[#dbe6ee]">
              {room?.members ?? 0} joined
            </span>
            <span className="rounded-full border border-white/10 bg-[#0d1720] px-3 py-2 text-xs text-[#dbe6ee]">
              {messages.length} messages
            </span>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
              {room?.joined ? "You joined" : "Join to talk"}
            </span>
          </div>
          {!room?.joined ? (
            <button
              type="button"
              onClick={joinTheRoom}
              className="mt-5 rounded-full bg-[#e7f0f7] px-5 py-3 text-sm font-semibold text-[#163042]"
            >
              Join this room
            </button>
          ) : null}
        </section>

        <section className="rounded-[24px] border border-white/10 bg-[#13202b] shadow-soft">
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
                No messages yet. Join the room and start the first line.
              </div>
            )}
          </div>
          <div className="border-t border-white/10 bg-[#13202b] p-4">
            <div className="flex gap-3">
              <input
                value={composer}
                onChange={(event) => setComposer(event.target.value)}
                placeholder={room?.joined ? "Say something..." : "Join the room first"}
                disabled={!room?.joined}
                className="min-w-0 flex-1 rounded-[14px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
              />
              <button
                type="button"
                disabled={pending || !room?.joined}
                onClick={send}
                className="rounded-[14px] bg-[#e7f0f7] px-5 py-3 text-sm font-semibold text-[#163042]"
              >
                {pending ? "Sending..." : "Send"}
              </button>
            </div>
            {!room?.joined ? <p className="mt-3 text-sm text-[#b9c6d3]">Join the room to take part in the discussion.</p> : null}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
