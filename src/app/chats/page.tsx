"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { getChats, getConversation, getMe, sendMessage, startChatWithUser, type ChatMessage, type ChatSummary, type AuthUser } from "@/lib/api";

export default function ChatsPage() {
  const searchParams = useSearchParams();
  const [me, setMe] = useState<AuthUser | null>(null);
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

  async function loadConversation(chatId: string) {
    try {
      const payload = await getConversation(chatId);
      setMessages(payload.conversation.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load conversation");
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

  useEffect(() => {
    void (async () => {
      try {
        const payload = await getMe();
        setMe(payload.user);
      } catch {
        setMe(null);
      }
    })();
  }, []);

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
          title="Direct messages"
          description="Pick a thread, open it, and keep the conversation moving."
        />

        <div className="grid gap-4 lg:grid-cols-[0.34fr_0.66fr]">
          <aside className="space-y-4 rounded-[24px] border border-white/10 bg-[#13202b] p-4 shadow-soft md:p-5">
            <div className="rounded-[20px] border border-white/10 bg-[#0d1720] p-3">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#8fb7d5]">New message</p>
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
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8fb7d5]">Inbox</p>
              <p className="text-xs text-[#b9c6d3]">{loading ? "Loading..." : `${chats.length} chats`}</p>
            </div>

            {loading ? (
              <div className="rounded-[18px] border border-white/10 bg-[#0d1720] p-4 text-sm text-[#b9c6d3]">Loading chats...</div>
            ) : chats.length ? (
              <div className="space-y-2">
                {chats.map((chat) => {
                  const active = activeChatId === chat.id;
                  const unread = unreadCountFor(chat);
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
                        <div className="min-w-0">
                          <p className="font-semibold text-white">{chat.title}</p>
                          <p className="mt-1 line-clamp-1 text-sm text-[#b9c6d3]">{chat.lastMessage}</p>
                        </div>
                        <span className="shrink-0 text-xs text-[#8fb7d5]">{unread ? `${unread} new` : "Seen"}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-[#b9c6d3]">
                        <span>{chat.subtitle}</span>
                        <span>{chat.messageCount} msgs</span>
                      </div>
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

          <section className="min-w-0 overflow-hidden rounded-[24px] border border-white/10 bg-[#13202b] shadow-soft">
            <div className="sticky top-0 z-10 border-b border-white/10 bg-[#13202b]/95 px-4 py-4 backdrop-blur md:px-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#e7f0f7] text-[#163042]">
                  {activeChat?.title?.[0] ?? "D"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#8fb7d5]">Conversation</p>
                  <h2 className="truncate text-xl font-semibold text-white">{activeChat?.title ?? "Select a conversation"}</h2>
                  <p className="truncate text-sm text-[#b9c6d3]">
                    {activeChat?.subtitle ?? "Choose a chat from the list to see the thread."}
                  </p>
                </div>
                {activeChat ? (
                  <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#dbe6ee] sm:inline-flex">
                    {unreadCountFor(activeChat) ? `${unreadCountFor(activeChat)} unread` : "Up to date"}
                  </div>
                ) : null}
              </div>
              {typing ? <p className="mt-3 text-xs text-[#8fb7d5]">Typing...</p> : null}
            </div>

            <div className="max-h-[58vh] space-y-3 overflow-y-auto bg-[linear-gradient(180deg,rgba(13,23,32,0.2),rgba(13,23,32,0.05))] p-4 md:p-5">
              {!activeChatId ? (
                <div className="grid min-h-[320px] place-items-center rounded-[22px] border border-dashed border-white/10 bg-[#0d1720] p-6 text-center">
                  <div className="max-w-sm space-y-3">
                    <p className="text-lg font-semibold text-white">Pick a conversation</p>
                    <p className="text-sm leading-6 text-[#b9c6d3]">
                      Select a thread from the left to start messaging in a cleaner, more familiar DM layout.
                    </p>
                  </div>
                </div>
              ) : messages.length ? (
                messages.map((message) => {
                  const mine = me?.id === message.sender.id;
                  return (
                    <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <article
                        className={`max-w-[85%] rounded-[22px] border px-4 py-3 shadow-soft sm:max-w-[70%] ${
                          mine
                            ? "border-[#2f7fb8]/40 bg-[#2f7fb8] text-white"
                            : "border-white/10 bg-[#0d1720] text-[#dbe6ee]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className={`text-xs font-semibold ${mine ? "text-white/90" : "text-[#8fb7d5]"}`}>
                            {mine ? "You" : message.sender.displayName}
                          </p>
                          <p className={`text-[11px] ${mine ? "text-white/70" : "text-[#b9c6d3]"}`}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                          </p>
                        </div>
                        {!mine ? (
                          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#8fb7d5]">
                            @{message.sender.username} · {message.sender.rank}
                          </p>
                        ) : null}
                        <p className="mt-3 text-sm leading-6">{message.body}</p>
                      </article>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[22px] border border-dashed border-white/10 bg-[#0d1720] p-6 text-sm text-[#b9c6d3]">
                  This thread is quiet. Drop the first line.
                </div>
              )}
            </div>

            <div className="border-t border-white/10 bg-[#13202b] p-3 md:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <textarea
                  value={composer}
                  onChange={(event) => setComposer(event.target.value)}
                  placeholder="Message..."
                  disabled={!activeChatId}
                  rows={1}
                  className="min-h-[52px] min-w-0 flex-1 resize-none rounded-[18px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9] disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled={!activeChatId || pending}
                  onClick={onSend}
                  className="rounded-[18px] bg-[#e7f0f7] px-5 py-3 text-sm font-semibold text-[#163042] sm:min-w-[112px]"
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
