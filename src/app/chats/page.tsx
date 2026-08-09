"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { getChats, getConversation, sendMessage, type ChatMessage, type ChatSummary } from "@/lib/api";

export default function ChatsPage() {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [composer, setComposer] = useState("");
  const [pending, startTransition] = useTransition();

  async function loadChats() {
    try {
      const payload = await getChats();
      setChats(payload.chats);
      setActiveChatId((current) => current ?? payload.chats[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load chats");
    } finally {
      setLoading(false);
    }
  }

  async function loadConversation(chatId: string) {
    try {
      const payload = await getConversation(chatId);
      setMessages(payload.conversation.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load conversation");
    }
  }

  useEffect(() => {
    void loadChats();
  }, []);

  useEffect(() => {
    if (!activeChatId) return;
    void loadConversation(activeChatId);
    const handle = window.setInterval(() => void loadConversation(activeChatId), 6000);
    return () => window.clearInterval(handle);
  }, [activeChatId]);

  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeChatId) ?? null, [activeChatId, chats]);

  async function onSend() {
    if (!activeChatId || !composer.trim()) return;
    const body = composer.trim();
    setComposer("");
    startTransition(async () => {
      try {
        const payload = await sendMessage(activeChatId, body);
        setMessages((current) => [...current, payload.message]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to send message");
      }
    });
  }

  return (
    <AppShell title="Chats" subtitle="Private conversations that feel fast and alive.">
      <div className="space-y-6">
        <SectionHeading eyebrow="Messaging" title="Your conversations" description="Tap in, read the thread, and send something back." />

        <div className="grid gap-4 lg:grid-cols-[0.38fr_0.62fr]">
          <aside className="space-y-3 rounded-[20px] border border-white/10 bg-[#13202b] p-4 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">Direct</p>
            {loading ? (
              <div className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4 text-sm text-[#b9c6d3]">Loading chats...</div>
            ) : chats.length ? (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full rounded-[18px] border p-4 text-left transition ${
                    activeChatId === chat.id
                      ? "border-[#8fb7d5]/40 bg-[#0d1720]"
                      : "border-white/10 bg-[#0d1720]/70 hover:bg-[#111c26]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{chat.title}</p>
                      <p className="mt-1 text-sm text-[#b9c6d3]">{chat.lastMessage}</p>
                    </div>
                    <span className="text-xs text-[#8fb7d5]">{chat.unread ? `${chat.unread} new` : "Seen"}</span>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.28em] text-[#b9c6d3]">{chat.subtitle}</p>
                </button>
              ))
            ) : (
              <div className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4 text-sm text-[#b9c6d3]">
                No chats yet. Open a profile and say hi.
              </div>
            )}
          </aside>

          <section className="rounded-[20px] border border-white/10 bg-[#13202b] shadow-soft">
            <div className="border-b border-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">Conversation</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{activeChat?.title ?? "Pick a chat"}</h2>
              <p className="mt-1 text-sm text-[#b9c6d3]">{activeChat?.subtitle ?? "Your messages will appear here."}</p>
            </div>

            <div className="max-h-[55vh] space-y-3 overflow-y-auto p-5">
              {messages.length ? (
                messages.map((message) => (
                  <article key={message.id} className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{message.sender.displayName}</p>
                        <p className="text-xs text-[#8fb7d5]">@{message.sender.username} · {message.sender.rank}</p>
                      </div>
                      <p className="text-xs text-[#b9c6d3]">{new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#dbe6ee]">{message.body}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-white/10 bg-[#0d1720] p-6 text-sm text-[#b9c6d3]">
                  This thread is quiet. Drop the first line.
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="flex gap-3">
                <input
                  value={composer}
                  onChange={(event) => setComposer(event.target.value)}
                  placeholder="Type a message..."
                  className="min-w-0 flex-1 rounded-[14px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
                />
                <button
                  type="button"
                  disabled={!activeChatId || pending}
                  onClick={onSend}
                  className="rounded-[14px] bg-[#e7f0f7] px-5 py-3 text-sm font-semibold text-[#163042]"
                >
                  {pending ? "Sending..." : "Send"}
                </button>
              </div>
              {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
