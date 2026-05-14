"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { dataProvider } from "@/lib/data";

export async function sendDirectMessage(conversationId: string, body: string) {
  const text = body.trim();
  if (!text) {
    return { ok: false as const, error: "Message is empty." };
  }
  const user = await getCurrentUser();
  const { mutations } = await dataProvider();
  const { messageId } = await mutations.messages.send(
    conversationId,
    user.id,
    text,
  );
  revalidatePath("/message");
  revalidatePath(`/message/${conversationId}`);
  return { ok: true as const, messageId };
}
