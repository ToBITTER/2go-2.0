import { AppShell } from "@/components/layout/app-shell";
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
            <div key={chat.name} className="rounded-[18px] border border-white/10 bg-[#13202b] p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{chat.name}</p>
                  <p className="mt-1 text-sm text-[#b9c6d3]">{chat.preview}</p>
                </div>
                <span className="text-xs text-[#8fb7d5]">{chat.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
