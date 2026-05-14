import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";

import { InviteForm } from "./invite-form";

export const metadata = { title: "Invite member" };

export default function InviteMemberPage() {
  return (
    <>
      <BackLink href="/admin/members" className="mt-4">
        Back to members
      </BackLink>
      <PageHeader
        title="Invite a member"
        description="Send an invitation email. The recipient will complete onboarding before joining."
      />
      <InviteForm />
    </>
  );
}
