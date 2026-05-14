"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { dataProvider } from "@/lib/data";

export async function moderationResolveAction(
  reportId: string,
  action: "keep" | "remove",
) {
  const user = await getCurrentUser();
  if (!can(user, "manage_spaces")) {
    throw new Error("Forbidden");
  }
  const { mutations } = await dataProvider();
  await mutations.admin.moderationResolve(reportId, action);
  revalidatePath("/admin/spaces");
}
