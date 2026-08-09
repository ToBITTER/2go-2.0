import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";
import Link from "next/link";

const rooms = [
  { name: "Football", online: 147, members: 1284, preview: "Match talk, banter, and live reactions." },
  { name: "Music", online: 96, members: 882, preview: "Songs, clips, and whatever is stuck in your head." },
  { name: "Tech", online: 84, members: 654, preview: "Quick takes and late-night ideas." },
];

export default function RoomsPage() {
  return (
    <AppShell title="Rooms" subtitle="Public rooms and good noise.">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Communities"
          title="Rooms that feel alive"
          description="Pick a room and step into the conversation."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {rooms.map((room) => (
            <Link key={room.name} href="/chats" className="rounded-[18px] border border-white/10 bg-[#13202b] p-5 shadow-soft transition hover:border-[#8fb7d5]/40 hover:bg-[#15232f]">
              <p className="text-lg font-semibold text-white">{room.name}</p>
              <p className="mt-2 text-sm text-[#b9c6d3]">{room.preview}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <p className="text-[#dbe6ee]">{room.members} members</p>
                <p className="text-[#8fb7d5]">{room.online} online</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
