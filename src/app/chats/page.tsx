"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { getChats, getConversation, sendMessage, startChatWithUser, type ChatMessage, type ChatSummary } from "@/lib/api";

export default function ChatsPage() {
  const searchParams = useSearchParams();
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usernameQuery, setUsernameQuery] = useState("");
  const [composer, setComposer] = useState("");
  const [typing, setTyping] = useState(false);
  const [pending, startTransition] = useTransition();
  const [seenCounts, setSeenCounts] = useState<Record<string, number>>({});

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

  function readSeenCounts() {
    try {
      const raw = window.localStorage.getItem("2go_chat_seen_counts");
      return raw ? (JSON.parse(raw) as Record<string, number>) : {};
    } catch {
      return {};
    }
  }

  function writeSeenCounts(next: Record<string, number>) {
    setSeenCounts(next);
    window.localStorage.setItem("2go_chat_seen_counts", JSON.stringify(next));
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
    setSeenCounts(readSeenCounts());
    void (async () => {
      await loadChats();
      const username = searchParams.get("with");
      if (!username) return;
      try {
        const payload = await startChatWithUser(username);
        setActiveChatId(payload.conversationId);
      } catch {
        return;
      }
    })();
  }, [searchParams]);

  useEffect(() => {
    if (!activeChatId) return;
    void loadConversation(activeChatId);
    const handle = window.setInterval(() => void loadConversation(activeChatId), 6000);
    return () => window.clearInterval(handle);
  }, [activeChatId]);

  useEffect(() => {
    if (!activeChatId) return;
    writeSeenCounts({ ...readSeenCounts(), [activeChatId]: messages.length });
  }, [activeChatId, messages]);

  useEffect(() => {
    if (!activeChatId) return;
    const trimmed = composer.trim();
    if (!trimmed) {
      setTyping(false);
      return;
    }
    setTyping(true);
    const handle = window.setTimeout(() => setTyping(false), 900);
    return () => window.clearTimeout(handle);
  }, [composer, activeChatId]);

  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeChatId) ?? null, [activeChatId, chats]);
  const unreadCountFor = (chat: ChatSummary) => Math.max(chat.messageCount - (seenCounts[chat.id] ?? 0), 0);

  async function onSend() {
    if (!activeChatId || !composer.trim()) return;
    const body = composer.trim();
    setComposer("");
    startTransition(async () => {
      try {
        const payload = await sendMessage(activeChatId, body);
        setMessages((current) => [...current, payload.message]);
        writeSeenCounts({ ...readSeenCounts(), [activeChatId]: messages.length + 1 });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to send message");
      }
    });
  }

  function onStartChat() {
    const username = usernameQuery.trim().replace(/^@/, "");
    if (!username) return;

    setError(null);
    startTransition(async () => {
      try {
        const payload = await startChatWithUser(username);
        await loadChats();
        setActiveChatId(payload.conversationId);
        writeSeenCounts({ ...readSeenCounts(), [payload.conversationId]: 0 });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to start chat");
      }
    });
  }

  return (
    <AppShell title="Chats" subtitle="Private conversations that feel fast and alive.">
      <div className="space-y-5 md:space-y-6">
        <SectionHeading
          eyebrow="Messaging"
          title="Your conversations"
          description="Pick a conversation from the list, then read and reply in the thread."
        />

        <div className="grid gap-4 lg:grid-cols-[0.36fr_0.64fr]">
          <aside className="space-y-4 rounded-[22px] border border-white/10 bg-[#13202b] p-4 shadow-soft md:p-5">
            <div className="rounded-[18px] border border-white/10 bg-[#0d1720] p-3">
              <p className="text-xs uppercase tracking-[0.25em] text-[#8fb7d5]">Start a chat</p>
              <div className="mt-3 flex gap-2">
                <input
                  value={usernameQuery}
                  onChange={(event) => setUsernameQuery(event.target.value)}
                  placeholder="Search username"
                  className="min-w-0 flex-1 rounded-[14px] border border-white/10 bg-[#13202b] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
                />
                <button
                  type="button"
                  disabled={!usernameQuery.trim() || pending}
                  onClick={onStartChat}
                  className="rounded-[14px] bg-[#e7f0f7] px-4 py-3 text-sm font-semibold text-[#163042]"
                >
                  Open
                </button>
              </div>
              <p className="mt-2 text-xs text-[#b9c6d3]">Type a username to open or create a thread.</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">Conversations</p>
              <p className="text-xs text-[#b9c6d3]">{loading ? "Loading..." : `${chats.length} chats`}</p>
            </div>

            {loading ? (
              <div className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4 text-sm text-[#b9c6d3]">Loading chats...</div>
            ) : chats.length ? (
              <div className="space-y-2">
                {chats.map((chat) => {
                  const active = activeChatId === chat.id;
                  return (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => setActiveChatId(chat.id)}
                      className={`w-full rounded-[18px] border p-4 text-left transition ${
                        active ? "border-[#8fb7d5]/40 bg-[#0d1720]" : "border-white/10 bg-[#0d1720]/70 hover:bg-[#111c26]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{chat.title}</p>
                          <p className="mt-1 line-clamp-1 text-sm text-[#b9c6d3]">{chat.lastMessage}</p>
                        </div>
                        <span className="shrink-0 text-xs text-[#8fb7d5]">
                          {unreadCountFor(chat) ? `${unreadCountFor(chat)} new` : "Seen"}
                        </span>
                      </div>
                      <p className="mt-3 text-xs uppercase tracking-[0.28em] text-[#b9c6d3]">{chat.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[18px] border border-dashed border-white/10 bg-[#0d1720] p-4 text-sm text-[#b9c6d3]">
                No chats yet. Search a username to start one.
              </div>
            )}
          </aside>

          <section className="min-w-0 rounded-[22px] border border-white/10 bg-[#13202b] shadow-soft">
            <div className="border-b border-white/10 p-4 md:p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">Conversation</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{activeChat?.title ?? "Select a conversation"}</h2>
              <p className="mt-1 text-sm text-[#b9c6d3]">
                {activeChat?.subtitle ?? "Choose a chat from the list to see the thread."}
              </p>
              {typing ? <p className="mt-2 text-xs text-[#8fb7d5]">You’re typing...</p> : null}
            </div>

            <div className="min-h-[320px] max-h-[58vh] space-y-3 overflow-y-auto p-4 md:p-5">
              {!activeChatId ? (
                <div className="grid h-full min-h-[320px] place-items-center rounded-[18px] border border-dashed border-white/10 bg-[#0d1720] p-6 text-center">
                  <div className="max-w-sm space-y-3">
                    <p className="text-lg font-semibold text-white">Pick a conversation</p>
                    <p className="text-sm leading-6 text-[#b9c6d3]">
                  Select any chat from the left, then your messages and composer will appear here.
                    </p>
                  </div>
                </div>
              ) : messages.length ? (
                messages.map((message) => (
                  <article key={message.id} className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{message.sender.displayName}</p>
                        <p className="text-xs text-[#8fb7d5]">
                          @{message.sender.username} · {message.sender.rank}
                        </p>
                      </div>
                      <p className="text-xs text-[#b9c6d3]">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </p>
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

            <div className="border-t border-white/10 p-3 md:p-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={composer}
                  onChange={(event) => setComposer(event.target.value)}
                  placeholder="Type a message..."
                  disabled={!activeChatId}
                  className="min-w-0 flex-1 rounded-[14px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9] disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled={!activeChatId || pending}
                  onClick={onSend}
                  className="rounded-[14px] bg-[#e7f0f7] px-5 py-3 text-sm font-semibold text-[#163042] sm:min-w-[110px]"
                >
                  {pending ? "Sending..." : "Send"}
                </button>
              </div>
              {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : <p className="mt-3 text-sm text-[#b9c6d3]">Choose a chat to reply.</p>}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
