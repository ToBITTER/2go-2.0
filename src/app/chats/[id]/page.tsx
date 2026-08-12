"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { getChats, getConversation, getMe, sendMessage, type AuthUser, type ChatMessage, type ChatSummary } from "@/lib/api";
import { getSocket } from "@/lib/realtime";

export default function ChatThreadPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [me, setMe] = useState<AuthUser | null>(null);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [composer, setComposer] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [remoteTyping, setRemoteTyping] = useState<string | null>(null);

  const chatId = params.id;
  const activeChat = useMemo(() => chats.find((chat) => chat.id === chatId) ?? null, [chatId, chats]);

  useEffect(() => {
    void (async () => {
      try {
        const [mePayload, chatsPayload, conversationPayload] = await Promise.all([
          getMe(),
          getChats(),
          getConversation(chatId),
        ]);
        setMe(mePayload.user);
        setChats(chatsPayload.chats);
        setMessages(conversationPayload.conversation.messages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load chat");
      }
    })();
  }, [chatId]);

  useEffect(() => {
    const handle = window.setInterval(async () => {
      try {
        const payload = await getConversation(chatId);
        setMessages(payload.conversation.messages);
      } catch {
        return;
      }
    }, 6000);
    return () => window.clearInterval(handle);
  }, [chatId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onTyping = (payload: { conversationId: string; username: string; isTyping: boolean }) => {
      if (payload.conversationId !== chatId) return;
      setRemoteTyping(payload.isTyping ? payload.username : null);
    };
    socket.on("chat:typing", onTyping);
    return () => {
      socket.off("chat:typing", onTyping);
    };
  }, [chatId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    if (!composer.trim()) {
      socket.emit("chat:typing", { conversationId: chatId, isTyping: false });
      return;
    }
    socket.emit("chat:typing", { conversationId: chatId, isTyping: true });
    const handle = window.setTimeout(() => socket.emit("chat:typing", { conversationId: chatId, isTyping: false }), 900);
    return () => {
      window.clearTimeout(handle);
      socket.emit("chat:typing", { conversationId: chatId, isTyping: false });
    };
  }, [chatId, composer]);

  function send() {
    if (!composer.trim()) return;
    const body = composer.trim();
    setComposer("");
    startTransition(async () => {
      try {
        const payload = await sendMessage(chatId, body);
        setMessages((current) => [...current, payload.message]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to send message");
      }
    });
  }

  return (
    <AppShell title="Chats" subtitle="Private conversations that feel fast and alive.">
      <div className="space-y-4 md:hidden">
        <button
          type="button"
          onClick={() => router.push("/chats")}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#13202b] px-3 py-2 text-xs font-medium text-[#dbe6ee]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to inbox
        </button>

        <section className="overflow-hidden rounded-[24px] border border-white/10 bg-[#13202b] shadow-soft">
          <div className="border-b border-white/10 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#8fb7d5]">Conversation</p>
                <h2 className="truncate text-lg font-semibold text-white">{activeChat?.title ?? "Chat"}</h2>
                <p className="truncate text-xs text-[#b9c6d3]">{activeChat?.subtitle ?? "Loading thread..."}</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 p-2 text-[#8fb7d5]">
                <MessageCircle className="h-4 w-4" />
              </div>
            </div>
            {remoteTyping ? <p className="mt-2 text-xs text-[#8fb7d5]">{remoteTyping} is typing...</p> : null}
          </div>

          <div className="max-h-[62vh] space-y-3 overflow-y-auto px-3 py-3">
            {messages.length ? (
              messages.map((message) => {
                const mine = me?.id === message.sender.id;
                return (
                  <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <article
                      className={`max-w-[84%] rounded-[20px] border px-3 py-2.5 shadow-sm ${
                        mine ? "border-[#2f7fb8]/40 bg-[#2f7fb8] text-white" : "border-white/10 bg-[#0d1720] text-[#dbe6ee]"
                      }`}
                    >
                      <p className={`text-xs font-semibold ${mine ? "text-white/90" : "text-[#8fb7d5]"}`}>
                        {mine ? "You" : message.sender.displayName}
                      </p>
                      <p className="mt-1.5 text-sm leading-6">{message.body}</p>
                    </article>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[20px] border border-dashed border-white/10 bg-[#0d1720] p-5 text-sm text-[#b9c6d3]">
                No messages yet. Start the thread.
              </div>
            )}
          </div>

          <div className="border-t border-white/10 bg-[#13202b] p-3">
            <textarea
              value={composer}
              onChange={(event) => setComposer(event.target.value)}
              placeholder="Message..."
              rows={3}
              className="w-full rounded-[16px] border border-white/10 bg-[#0d1720] px-4 py-3 text-sm text-white outline-none placeholder:text-[#7f95a9]"
            />
            <button
              type="button"
              disabled={pending}
              onClick={send}
              className="mt-3 w-full rounded-[16px] bg-[#e7f0f7] px-5 py-3 text-sm font-semibold text-[#163042]"
            >
              {pending ? "Sending..." : "Send"}
            </button>
            {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
          </div>
        </section>
      </div>

      <div className="hidden md:block">
        <p className="text-sm text-[#b9c6d3]">
          Open this conversation from the inbox. The full split-screen view stays on desktop.
        </p>
      </div>
    </AppShell>
  );
}
