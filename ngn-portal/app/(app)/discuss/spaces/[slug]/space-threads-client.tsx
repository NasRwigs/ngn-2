"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquare, Pin, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tag } from "@/components/ui/tag";
import { formatRelative } from "@/lib/format/date";
import { toast } from "@/components/ui/toaster";

import { createDiscussionThread } from "../actions";

export interface SpaceThreadRow {
  id: string;
  title: string;
  lastActivityAt: string;
  messageCount: number;
  pinned?: boolean;
  authorName: string;
}

interface SpaceThreadsClientProps {
  spaceSlug: string;
  spaceName: string;
  threads: SpaceThreadRow[];
}

export function SpaceThreadsClient({
  spaceSlug,
  spaceName,
  threads,
}: SpaceThreadsClientProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleCreate() {
    const t = title.trim();
    const b = body.trim();
    if (!t || !b) {
      toast.error("Add a title and opening message.");
      return;
    }
    setSubmitting(true);
    try {
      const { threadId } = await createDiscussionThread(spaceSlug, t, b);
      toast.success("Thread published");
      setOpen(false);
      setTitle("");
      setBody("");
      router.push(`/discuss/spaces/${spaceSlug}/threads/${threadId}`);
      router.refresh();
    } catch {
      toast.error("Could not create thread. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-headline-md text-on-surface">Threads</h2>
        <Button type="button" onClick={() => setOpen(true)}>
          <Plus className="size-4" aria-hidden />
          New thread
        </Button>
      </div>
      <p className="text-body-md text-on-surface-variant">
        Conversations in <span className="font-medium text-on-surface">{spaceName}</span>.
        Select a thread to read the full discussion or post a reply.
      </p>

      {threads.length === 0 ? (
        <Card className="p-8 text-center text-on-surface-variant">
          <MessageSquare className="size-10 mx-auto mb-3 opacity-50" aria-hidden />
          <p className="font-medium text-on-surface">No threads yet</p>
          <p className="text-sm mt-1">Start the first conversation in this space.</p>
        </Card>
      ) : (
        <ul className="space-y-2">
          {threads.map((thread) => (
            <li key={thread.id}>
              <Link
                href={`/discuss/spaces/${spaceSlug}/threads/${thread.id}`}
                className="block rounded-lg border border-outline-variant bg-surface-container-lowest p-4 hover:bg-surface-container transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {thread.pinned && (
                    <Tag size="sm" className="gap-1">
                      <Pin className="size-3" aria-hidden />
                      Pinned
                    </Tag>
                  )}
                  <span className="text-xs text-on-surface-variant">
                    {thread.messageCount} message{thread.messageCount === 1 ? "" : "s"}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    · {formatRelative(thread.lastActivityAt)}
                  </span>
                </div>
                <p className="mt-2 font-medium text-on-surface">{thread.title}</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Started by {thread.authorName}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent layout="sheet" className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New thread in {spaceName}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormField label="Title" htmlFor="thread-title" required>
              <Input
                id="thread-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to discuss?"
                maxLength={200}
              />
            </FormField>
            <FormField label="Opening message" htmlFor="thread-body" required>
              <Textarea
                id="thread-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                placeholder="Share context, links, or a question to kick things off."
              />
            </FormField>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreate} loading={submitting}>
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
