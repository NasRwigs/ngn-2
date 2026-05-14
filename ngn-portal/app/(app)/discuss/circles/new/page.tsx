import { redirect } from "next/navigation";

import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { can } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";

import { CreateCircleForm } from "./create-form";

export const metadata = { title: "Create circle" };

export default async function CreateCirclePage() {
  const user = await getCurrentUser();
  if (!can(user, "create_circle")) {
    redirect("/discuss/circles");
  }
  return (
    <>
      <BackLink href="/discuss/circles" className="mt-4">
        Back to circles
      </BackLink>
      <PageHeader
        title="Create circle"
        description="Set up a small-group circle with a topic, cadence, and capacity."
      />
      <CreateCircleForm />
    </>
  );
}
