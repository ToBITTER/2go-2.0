import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";

const rooms = [
  { name: "Football", online: 147, members: 1284 },
  { name: "Music", online: 96, members: 882 },
  { name: "Tech", online: 84, members: 654 },
];

export default function RoomsPage() {
  return (
    <AppShell title="Rooms" subtitle="Public rooms and good noise.">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Communities"
          title="Rooms that feel alive"
          description="Pick a room and slide in."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {rooms.map((room) => (
            <article key={room.name} className="rounded-[18px] border border-white/10 bg-[#13202b] p-5 shadow-soft">
              <p className="text-lg font-semibold text-white">{room.name}</p>
              <p className="mt-2 text-sm text-[#b9c6d3]">{room.members} members</p>
              <p className="text-sm text-[#8fb7d5]">{room.online} online</p>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
