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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [usersPayload, roomsPayload] = await Promise.all([getUsers(), getRooms()]);
        setUsers(usersPayload.users);
        setRooms(roomsPayload.rooms);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load discover data");
      } finally {
        setLoading(false);
      }
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

  const filteredRooms = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return rooms;
    return rooms.filter((room) =>
      [room.name, room.description, room.category, room.lastMessage].join(" ").toLowerCase().includes(value),
    );
  }, [query, rooms]);

  const onlineCount = filteredUsers.filter((user) => user.online).length;
  const topRanks = [...filteredUsers]
    .sort((a, b) => a.rank.localeCompare(b.rank) || a.displayName.localeCompare(b.displayName))
    .slice(0, 4);

  return (
    <AppShell title="Discover" subtitle="Find people, rooms, and conversations that feel alive.">
      <div className="space-y-6">
        <SectionHeading eyebrow="Discovery" title="Find your people" description="Search users or rooms, then jump in right away." />
        {error ? (
          <div className="rounded-[18px] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <div className="rounded-[20px] border border-white/10 bg-[#13202b] p-5 shadow-soft">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search people or rooms..."
              className="w-full rounded-[14px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
            />
            <div className="flex gap-2">
              <span className="rounded-full border border-white/10 bg-[#0d1720] px-3 py-2 text-xs text-[#dbe6ee]">
                {onlineCount} online
              </span>
              <span className="rounded-full border border-white/10 bg-[#0d1720] px-3 py-2 text-xs text-[#dbe6ee]">
                {filteredUsers.length} people
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.6fr_0.4fr]">
          <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-white">People</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {loading ? (
                <div className="rounded-[18px] border border-dashed border-white/10 bg-[#0d1720] p-6 text-sm text-[#b9c6d3]">
                  Loading people...
                </div>
              ) : filteredUsers.length ? (
                filteredUsers.map((user) => (
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
                    <div className="mt-3">
                      <span
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                          user.online ? "bg-emerald-400/10 text-emerald-300" : "bg-white/5 text-[#b9c6d3]"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${user.online ? "bg-emerald-300" : "bg-[#7f95a9]"}`} />
                        {user.online ? "Online now" : "Offline"}
                      </span>
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
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-white/10 bg-[#0d1720] p-6 text-sm text-[#b9c6d3]">
                  No matching people yet.
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-white">Rank lane</h2>
              <p className="mt-2 text-sm leading-6 text-[#b9c6d3]">
                A quick look at people with strong presence right now.
              </p>
              <div className="mt-4 space-y-3">
                {topRanks.length ? (
                  topRanks.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-3 rounded-[16px] border border-white/10 bg-[#0d1720] px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{user.displayName}</p>
                        <p className="truncate text-sm text-[#8fb7d5]">@{user.username}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#dbe6ee]">
                        {user.rank}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[18px] border border-dashed border-white/10 bg-[#0d1720] p-6 text-sm text-[#b9c6d3]">
                    No ranked users found yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-white">Rooms</h2>
              <div className="mt-4 space-y-3">
                {loading ? (
                  <div className="rounded-[18px] border border-dashed border-white/10 bg-[#0d1720] p-6 text-sm text-[#b9c6d3]">
                    Loading rooms...
                  </div>
                ) : filteredRooms.length ? (
                  filteredRooms.map((room) => (
                    <Link
                      key={room.slug}
                      href={`/rooms/${encodeURIComponent(room.slug)}`}
                      className="block rounded-[18px] border border-white/10 bg-[#0d1720] px-4 py-3 transition hover:border-[#8fb7d5]/40 hover:bg-[#111c26]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{room.name}</p>
                          <p className="text-sm text-[#b9c6d3]">{room.description}</p>
                        </div>
                        <p className="text-xs text-[#8fb7d5]">{room.online} online</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-[18px] border border-dashed border-white/10 bg-[#0d1720] p-6 text-sm text-[#b9c6d3]">
                    No matching rooms yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
