"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { getRooms, getUsers, type AuthUser, type RoomSummary } from "@/lib/api";

export default function DiscoverPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void (async () => {
      const [usersPayload, roomsPayload] = await Promise.all([getUsers(), getRooms()]);
      setUsers(usersPayload.users);
      setRooms(roomsPayload.rooms);
    })();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return users;
    return users.filter((user) =>
      [user.username, user.displayName, user.bio, user.rank, ...(user.interests ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(value),
    );
  }, [query, users]);

  return (
    <AppShell title="Discover" subtitle="Find people, rooms, and conversations that feel alive.">
      <div className="space-y-6">
        <SectionHeading eyebrow="Discovery" title="Find your people" description="Search around, open a profile, and start talking." />

        <div className="grid gap-4 lg:grid-cols-[0.6fr_0.4fr]">
          <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">People</h2>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search users..."
                className="w-full max-w-sm rounded-[14px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
              />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {filteredUsers.map((user) => (
                <article key={user.id} className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#e7f0f7] text-[#163042]">
                      {user.displayName?.[0] ?? "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{user.displayName}</p>
                      <p className="text-sm text-[#8fb7d5]">@{user.username}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#b9c6d3]">{user.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-[#13202b] px-3 py-1 text-xs text-[#dbe6ee]">{user.rank}</span>
                    {(user.interests ?? []).slice(0, 3).map((interest) => (
                      <span key={interest} className="rounded-full border border-white/10 bg-[#13202b] px-3 py-1 text-xs text-[#dbe6ee]">
                        {interest}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/profile/${encodeURIComponent(user.username)}`}
                      className="rounded-full bg-[#e7f0f7] px-4 py-2 text-sm font-semibold text-[#163042]"
                    >
                      View profile
                    </Link>
                    <Link
                      href={`/chats?with=${encodeURIComponent(user.username)}`}
                      className="rounded-full border border-white/10 bg-[#0d1720] px-4 py-2 text-sm font-semibold text-[#dbe6ee]"
                    >
                      Message
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-white">Active rooms</h2>
            <div className="mt-4 space-y-3">
              {rooms.map((room) => (
                <Link key={room.slug} href={`/rooms/${encodeURIComponent(room.slug)}`} className="block rounded-[18px] border border-white/10 bg-[#0d1720] px-4 py-3 transition hover:border-[#8fb7d5]/40 hover:bg-[#111c26]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{room.name}</p>
                      <p className="text-sm text-[#b9c6d3]">{room.description}</p>
                    </div>
                    <p className="text-xs text-[#8fb7d5]">{room.online} online</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
