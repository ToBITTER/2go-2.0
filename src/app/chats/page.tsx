import { AppShell } from "@/components/app-shell";
import { SectionHeading } from "@/components/section-heading";

const chats = [
  { name: "David", preview: "You dey the football room tonight?", time: "2m" },
  { name: "Tolu", preview: "Send the song link abeg.", time: "8m" },
  { name: "Jay", preview: "I just opened a new room.", time: "14m" },
];

export default function ChatsPage() {
  return (
    <AppShell title="Chats" subtitle="Private conversations that feel fast and alive.">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Messaging"
          title="Your conversations"
          description="The app shell is now ready for the realtime messaging phase."
        />
        <div className="space-y-3">
          {chats.map((chat) => (
            <div key={chat.name} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{chat.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{chat.preview}</p>
                </div>
                <span className="text-xs text-slate-400">{chat.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
