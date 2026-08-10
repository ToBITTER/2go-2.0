"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { getRooms, getRoom, sendRoomMessage, type RoomMessage, type RoomSummary } from "@/lib/api";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [composer, setComposer] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void (async () => {
      const payload = await getRooms();
      setRooms(payload.rooms);
      setActiveSlug(payload.rooms[0]?.slug ?? null);
    })();
  }, []);

  useEffect(() => {
    if (!activeSlug) return;
    void (async () => {
      const payload = await getRoom(activeSlug);
      setMessages(payload.messages);
    })();
    const handle = window.setInterval(async () => {
      const payload = await getRoom(activeSlug);
      setMessages(payload.messages);
    }, 6000);
    return () => window.clearInterval(handle);
  }, [activeSlug]);

  const activeRoom = useMemo(() => rooms.find((room) => room.slug === activeSlug) ?? null, [activeSlug, rooms]);

  function send() {
    if (!activeSlug || !composer.trim()) return;
    const body = composer.trim();
    setComposer("");
    startTransition(async () => {
      const payload = await sendRoomMessage(activeSlug, body);
      setMessages((current) => [...current, payload.message]);
    });
  }

  return (
    <AppShell title="Rooms" subtitle="Public rooms and good noise.">
      <div className="space-y-6">
        <SectionHeading eyebrow="Communities" title="Rooms that feel alive" description="Pick a room and step into the conversation." />
        <div className="grid gap-4 lg:grid-cols-[0.34fr_0.66fr]">
          <aside className="space-y-3 rounded-[20px] border border-white/10 bg-[#13202b] p-4 shadow-soft">
            {rooms.map((room) => (
              <button
                key={room.slug}
                type="button"
                onClick={() => setActiveSlug(room.slug)}
                className={`w-full rounded-[18px] border p-4 text-left transition ${
                  activeSlug === room.slug ? "border-[#8fb7d5]/40 bg-[#0d1720]" : "border-white/10 bg-[#0d1720]/70 hover:bg-[#111c26]"
                }`}
              >
                <p className="text-lg font-semibold text-white">{room.name}</p>
                <p className="mt-2 text-sm text-[#b9c6d3]">{room.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <p className="text-[#dbe6ee]">{room.members} members</p>
                  <p className="text-[#8fb7d5]">{room.online} online</p>
                </div>
              </button>
            ))}
          </aside>

          <section className="rounded-[20px] border border-white/10 bg-[#13202b] shadow-soft">
            <div className="border-b border-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">Live room</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{activeRoom?.name ?? "Pick a room"}</h2>
              <p className="mt-1 text-sm text-[#b9c6d3]">{activeRoom?.description ?? "A live room will show up here."}</p>
            </div>
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
                  This room is quiet right now. Start the first line.
                </div>
              )}
            </div>
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-3">
                <input
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  placeholder="Say something..."
                  className="min-w-0 flex-1 rounded-[14px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
                />
                <button
                  type="button"
                  disabled={pending || !activeSlug}
                  onClick={send}
                  className="rounded-[14px] bg-[#e7f0f7] px-5 py-3 text-sm font-semibold text-[#163042]"
                >
                  {pending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
