"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { dataProvider } from "@/lib/data";

export async function createDiscussionThread(
  spaceSlug: string,
  title: string,
  body: string,
) {
  const user = await getCurrentUser();
  const { mutations } = await dataProvider();
  const { threadId } = await mutations.spaces.createThread(spaceSlug, user.id, {
    title,
    body,
  });
  revalidatePath(`/discuss/spaces/${spaceSlug}`);
  revalidatePath(`/discuss/spaces/${spaceSlug}/threads/${threadId}`);
  return { threadId };
}

export async function replyToDiscussionThread(
  spaceSlug: string,
  threadId: string,
  body: string,
) {
  const user = await getCurrentUser();
  const { mutations } = await dataProvider();
  await mutations.spaces.replyToThread(spaceSlug, threadId, user.id, body);
  revalidatePath(`/discuss/spaces/${spaceSlug}`);
  revalidatePath(`/discuss/spaces/${spaceSlug}/threads/${threadId}`);
}
