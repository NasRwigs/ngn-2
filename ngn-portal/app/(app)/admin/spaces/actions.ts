"use server";

import { revalidatePath } from "next/cache";

import { dataProvider } from "@/lib/data";

export async function moderationResolveAction(
  reportId: string,
  action: "keep" | "remove",
) {
  const { mutations } = await dataProvider();
  await mutations.admin.moderationResolve(reportId, action);
  revalidatePath("/admin/spaces");
}
