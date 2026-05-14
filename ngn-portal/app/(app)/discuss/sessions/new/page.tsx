import { redirect } from "next/navigation";

import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { can } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";

import { CreateSessionForm } from "./create-form";

export const metadata = { title: "Host a session" };

export default async function NewSessionPage() {
  const user = await getCurrentUser();
  if (!can(user, "create_session")) {
    redirect("/discuss/sessions");
  }
  return (
    <>
      <BackLink href="/discuss/sessions" className="mt-4">
        Back to sessions
      </BackLink>
      <PageHeader
        title="Host a session"
        description="Set up an AMA, masterclass, or one-to-many discussion."
      />
      <CreateSessionForm />
    </>
  );
}
