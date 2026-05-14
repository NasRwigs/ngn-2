import { redirect } from "next/navigation";

import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { can } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";

import { CreateEventForm } from "./create-form";

export const metadata = { title: "Create event" };

export default async function CreateEventPage() {
  const user = await getCurrentUser();
  if (!can(user, "create_event")) {
    redirect("/events");
  }
  return (
    <>
      <BackLink href="/events" className="mt-4">
        Back to events
      </BackLink>
      <PageHeader
        title="Create event"
        description="Build an event with full programme metadata. Save as draft or publish immediately."
      />
      <CreateEventForm />
    </>
  );
}
