import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Invitation" };

export default function InvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; from?: string }>;
}) {
  return <InvitationInner searchParams={searchParams} />;
}

async function InvitationInner({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; from?: string }>;
}) {
  const params = await searchParams;
  const inviter = params.from ?? "the NGN team";
  const valid = Boolean(params.token);

  if (!valid) {
    return (
      <div className="min-h-dvh grid place-items-center p-6">
        <Card className="max-w-md p-6 text-center" accent="red">
          <h1 className="text-headline-md text-on-surface">
            Invitation link is invalid
          </h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            The link may have expired or already been used. Ask your ExCo
            sponsor for a new invitation.
          </p>
          <Button asChild className="mt-4">
            <Link href="/landing">Go to landing page</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-dvh grid place-items-center p-6 bg-afro-pattern">
      <Card className="max-w-md p-6 md:p-8" accent="blue">
        <p className="text-label-sm uppercase tracking-wide text-secondary font-medium">
          You&apos;re invited
        </p>
        <h1 className="mt-2 text-headline-md text-on-surface">
          Welcome to NGN
        </h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          {inviter} invited you to join the Now Generation Network. Set up your
          account to get started.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <Button asChild fullWidth>
            <Link href={`/onboarding?token=${params.token}`}>
              Accept &amp; create account
            </Link>
          </Button>
          <Button asChild variant="ghost" fullWidth>
            <Link href="/landing">Maybe later</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
