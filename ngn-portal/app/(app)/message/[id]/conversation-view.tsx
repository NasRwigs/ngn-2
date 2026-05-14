"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MoreVertical, Paperclip, Send } from "lucide-react";

import { Avatar } from "@/components/app-shell/avatar";
import { Button } from "@/components/ui/button";
import { useRealtimeChannel } from "@/lib/realtime/use-realtime-channel";
import { cn } from "@/components/ui/cn";
import { formatTime } from "@/lib/format/date";

interface Message {
  id: string;
  senderId: string;
  body: string;
  sentAt: string;
}

interface ConversationViewProps {
  conversationId: string;
  currentUserId: string;
  other: { id: string; name: string; avatarUrl: string | null; title: string } | null;
  initialMessages: Message[];
}

export function ConversationView({
  conversationId,
  currentUserId,
  other,
  initialMessages,
}: ConversationViewProps) {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useRealtimeChannel<Message[]>(`conversation:${conversationId}`, {
    pollFn: async () => messages,
    onUpdate: () => {
      // No-op in mock. Real impl: merge in new messages broadcast by Supabase Realtime.
    },
  });

  async function send() {
    const body = input.trim();
    if (!body || sending) return;
    setSending(true);
    const optimistic: Message = {
      id: `local_${Date.now()}`,
      senderId: currentUserId,
      body,
      sentAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    await new Promise((r) => setTimeout(r, 200));
    setSending(false);
  }

  function handleKey(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  }

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-16 -mb-24 md:-mb-12 h-[calc(100dvh-7rem)] md:h-[calc(100dvh-3.5rem)] flex flex-col bg-surface">
      <header className="flex items-center gap-3 px-3 md:px-6 py-3 border-b border-outline-variant bg-surface-container-lowest">
        <Link
          href="/message"
          aria-label="Back to inbox"
          className="md:hidden size-9 grid place-items-center rounded-full hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>

        {other && (
          <Link
            href={`/connect/${other.id}`}
            className="flex items-center gap-3 min-w-0 flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <Avatar src={other.avatarUrl} name={other.name} size={40} />
            <div className="min-w-0">
              <p className="font-medium text-on-surface truncate">
                {other.name}
              </p>
              <p className="text-xs text-on-surface-variant truncate">
                {other.title}
              </p>
            </div>
          </Link>
        )}

        <button
          type="button"
          aria-label="More options"
          className="size-9 grid place-items-center rounded-full hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <MoreVertical className="size-5" aria-hidden />
        </button>
      </header>

      <ol className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-2">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <li
              key={msg.id}
              className={cn("flex", isMe ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3 py-2",
                  isMe
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface",
                )}
              >
                <p className="whitespace-pre-line break-words text-sm">
                  {msg.body}
                </p>
                <time
                  dateTime={msg.sentAt}
                  className={cn(
                    "block mt-0.5 text-[10px]",
                    isMe
                      ? "text-on-primary/80"
                      : "text-on-surface-variant",
                  )}
                >
                  {formatTime(msg.sentAt)}
                </time>
              </div>
            </li>
          );
        })}
        <div ref={endRef} aria-hidden />
      </ol>

      <div className="border-t border-outline-variant bg-surface-container-lowest px-3 md:px-6 py-3">
        <div className="flex items-end gap-2">
          <button
            type="button"
            aria-label="Attach file"
            className="size-10 shrink-0 grid place-items-center rounded-full hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Paperclip className="size-5" aria-hidden />
          </button>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKey}
            placeholder={`Message ${other?.name ?? ""}`}
            rows={1}
            aria-label="Message body"
            className="flex-1 resize-none rounded-2xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary max-h-32"
          />
          <Button
            type="button"
            onClick={send}
            disabled={!input.trim() || sending}
            aria-label="Send message"
            className="size-10 p-0"
          >
            <Send className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
