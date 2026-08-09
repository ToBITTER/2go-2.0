import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";

const rooms = [
  { name: "Football", online: 147, members: 1284 },
  { name: "Music", online: 96, members: 882 },
  { name: "Tech", online: 84, members: 654 },
];

export default function RoomsPage() {
  return (
    <AppShell title="Rooms" subtitle="Public rooms are the beating heart of 2go 2.0.">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Communities"
          title="Rooms that feel alive"
          description="This route is ready for the public-room experience, presence, and live chat."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {rooms.map((room) => (
            <article key={room.name} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-soft">
              <p className="text-lg font-semibold">{room.name}</p>
              <p className="mt-2 text-sm text-slate-300">{room.members} members</p>
              <p className="text-sm text-cyan-200">{room.online} online</p>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
