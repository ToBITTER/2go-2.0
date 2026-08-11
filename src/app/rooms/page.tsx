"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { getRooms, getRoom, sendRoomMessage, type RoomMessage, type RoomSummary } from "@/lib/api";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [composer, setComposer] = useState("");
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void (async () => {
      try {
        const payload = await getRooms();
        setRooms(payload.rooms);
        setActiveSlug(payload.rooms[0]?.slug ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load rooms");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!activeSlug) return;
    void (async () => {
      try {
        const payload = await getRoom(activeSlug);
        setMessages(payload.messages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load room");
      }
    })();
    const handle = window.setInterval(async () => {
      try {
        const payload = await getRoom(activeSlug);
        setMessages(payload.messages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to refresh room");
      }
    }, 6000);
    return () => window.clearInterval(handle);
  }, [activeSlug]);

  useEffect(() => {
    if (!activeSlug) return;
    const trimmed = composer.trim();
    if (!trimmed) {
      setTyping(false);
      return;
    }
    setTyping(true);
    const handle = window.setTimeout(() => setTyping(false), 900);
    return () => window.clearTimeout(handle);
  }, [composer, activeSlug]);

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
      <div className="space-y-5 md:space-y-6">
        <SectionHeading eyebrow="Communities" title="Rooms that feel alive" description="Pick a room and step into the conversation." />
        {error ? (
          <div className="rounded-[18px] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-[0.34fr_0.66fr]">
          <aside className="space-y-3 rounded-[22px] border border-white/10 bg-[#13202b] p-4 shadow-soft md:p-5">
            {loading ? (
              <div className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4 text-sm text-[#b9c6d3]">Loading rooms...</div>
            ) : rooms.length ? (
              rooms.map((room) => (
                <Link
                  key={room.slug}
                  href={`/rooms/${encodeURIComponent(room.slug)}`}
                  className={`block w-full rounded-[18px] border p-4 text-left transition ${
                    activeSlug === room.slug ? "border-[#8fb7d5]/40 bg-[#0d1720]" : "border-white/10 bg-[#0d1720]/70 hover:bg-[#111c26]"
                  }`}
                  onClick={() => setActiveSlug(room.slug)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{room.name}</p>
                      <p className="mt-2 text-sm leading-6 text-[#b9c6d3]">{room.description}</p>
                    </div>
                    <p className="shrink-0 text-xs text-[#8fb7d5]">{room.online} online</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <p className="text-[#dbe6ee]">{room.category}</p>
                    <p className="text-[#8fb7d5]">{room.joined ? "You joined" : "Open"}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-white/10 bg-[#0d1720] p-4 text-sm text-[#b9c6d3]">
                No rooms found in the database yet.
              </div>
            )}
          </aside>

          <section className="min-w-0 overflow-hidden rounded-[22px] border border-white/10 bg-[#13202b] shadow-soft">
            <div className="border-b border-white/10 p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">Live room</p>
                  <h2 className="truncate text-2xl font-semibold text-white">{activeRoom?.name ?? "Pick a room"}</h2>
                  <p className="mt-1 text-sm text-[#b9c6d3]">{activeRoom?.description ?? "A live room will show up here."}</p>
                </div>
                {activeRoom ? (
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#dbe6ee]">
                    {activeRoom.members} people
                  </div>
                ) : null}
              </div>
              {activeRoom ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    {activeRoom.online} online now
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[#dbe6ee]">
                    {activeRoom.members} here in total
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[#dbe6ee]">
                    {activeRoom.joined ? "You are in this room" : "Open room"}
                  </span>
                </div>
              ) : null}
              {typing ? <p className="mt-2 text-xs text-[#8fb7d5]">You&apos;re typing...</p> : null}
            </div>

            <div className="max-h-[58vh] space-y-3 overflow-y-auto overscroll-contain p-4 md:p-5">
              {!activeSlug ? (
                <div className="rounded-[18px] border border-dashed border-white/10 bg-[#0d1720] p-6 text-sm text-[#b9c6d3]">
                  Pick a room from the list to see messages.
                </div>
              ) : messages.length ? (
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
                  This room is quiet right now. Join the room and start the first line.
                </div>
              )}
            </div>

            <div className="sticky bottom-0 border-t border-white/10 bg-[#13202b] p-3 md:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <input
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  placeholder="Say something..."
                  disabled={!activeSlug}
                  className="min-w-0 flex-1 rounded-[14px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9] disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled={pending || !activeSlug}
                  onClick={send}
                  className="rounded-[14px] bg-[#e7f0f7] px-5 py-3 text-sm font-semibold text-[#163042] sm:min-w-[110px]"
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
