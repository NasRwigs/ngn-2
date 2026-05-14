import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";

import { CreateSpaceForm } from "./create-form";

export const metadata = { title: "Create space" };

export default function NewSpacePage() {
  return (
    <>
      <BackLink href="/admin/spaces" className="mt-4">
        Back to spaces
      </BackLink>
      <PageHeader
        title="Create discussion space"
        description="Set up a new threaded discussion space."
      />
      <CreateSpaceForm />
    </>
  );
}
