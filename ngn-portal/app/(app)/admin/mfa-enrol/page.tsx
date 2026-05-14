import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";

import { EnrolMfa } from "./enrol-mfa";

export const metadata = { title: "Set up two-factor authentication" };

export default function MfaEnrolPage() {
  return (
    <>
      <BackLink href="/settings" className="mt-4">
        Back to settings
      </BackLink>
      <PageHeader
        title="Set up two-factor authentication"
        description="Add an authenticator app to your account. Required for all admins."
      />
      <EnrolMfa />
    </>
  );
}
