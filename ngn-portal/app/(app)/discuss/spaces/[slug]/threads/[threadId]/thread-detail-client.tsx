"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";

import { Avatar } from "@/components/app-shell/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/format/date";
import { cn } from "@/components/ui/cn";
import { toast } from "@/components/ui/toaster";

import { replyToDiscussionThread } from "../../../actions";

export interface ThreadPostVM {
  id: string;
  body: string;
  sentAt: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string | null;
  /** First post in the thread (opening message). */
  isOriginal?: boolean;
}

interface ThreadDetailClientProps {
  spaceSlug: string;
  spaceName: string;
  threadId: string;
  threadTitle: string;
  posts: ThreadPostVM[];
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string | null;
}

export function ThreadDetailClient({
  spaceSlug,
  spaceName,
  threadId,
  threadTitle,
  posts,
  currentUserId,
  currentUserName,
  currentUserAvatar,
}: ThreadDetailClientProps) {
  const router = useRouter();
  const [body, setBody] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts.length]);

  async function sendReply() {
    const text = body.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    try {
      await replyToDiscussionThread(spaceSlug, threadId, text);
      setBody("");
      toast.success("Reply posted");
      router.refresh();
    } catch {
      toast.error("Could not post reply.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-12">
      <div>
        <Link
          href={`/discuss/spaces/${spaceSlug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to {spaceName}
        </Link>
        <h1 className="mt-3 text-headline-lg text-on-surface">{threadTitle}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {spaceName} · {posts.length} message{posts.length === 1 ? "" : "s"}
        </p>
      </div>

      <ul className="space-y-4">
        {posts.map((post) => {
          const mine = post.authorId === currentUserId;
          return (
            <li
              key={post.id}
              className={cn(
                "flex gap-3",
                mine ? "flex-row-reverse text-right" : "flex-row",
              )}
            >
              <Avatar
                src={post.authorAvatarUrl ?? null}
                name={post.authorName}
                size={40}
                className="shrink-0"
              />
              <div
                className={cn(
                  "min-w-0 max-w-[min(100%,42rem)] rounded-2xl border px-4 py-3",
                  mine
                    ? "border-primary/30 bg-primary-container text-on-primary-container"
                    : "border-outline-variant bg-surface-container-lowest",
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 gap-y-0">
                  <span className="text-sm font-medium text-on-surface">
                    {post.authorName}
                    {post.isOriginal && (
                      <span className="ml-2 text-xs font-normal text-on-surface-variant">
                        (original post)
                      </span>
                    )}
                  </span>
                  <time
                    className="text-xs text-on-surface-variant whitespace-nowrap"
                    dateTime={post.sentAt}
                  >
                    {formatDateTime(post.sentAt)}
                  </time>
                </div>
                <p className="mt-2 text-body-md whitespace-pre-wrap break-words">
                  {post.body}
                </p>
              </div>
            </li>
          );
        })}
        <div ref={endRef} />
      </ul>

      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-outline-variant bg-surface-container-lowest p-3 md:static md:z-0 md:border-0 md:bg-transparent md:p-0">
        <div className="max-w-3xl mx-auto md:mx-0 flex gap-2 items-end">
          <Avatar
            src={currentUserAvatar}
            name={currentUserName}
            size={36}
            className="hidden sm:block shrink-0"
          />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            placeholder="Write a reply…"
            className="min-h-[3rem] flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendReply();
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            className="shrink-0"
            onClick={() => void sendReply()}
            loading={submitting}
            disabled={!body.trim()}
            aria-label="Send reply"
          >
            <Send className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
