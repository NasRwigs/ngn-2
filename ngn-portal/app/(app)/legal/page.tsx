import { BackLink } from "@/components/ui/back-link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = { title: "Legal" };

export default function LegalPage() {
  return (
    <>
      <BackLink href="/settings" className="mt-4">
        Back to settings
      </BackLink>
      <PageHeader
        title="Legal"
        description="Privacy policy, terms of service, and code of conduct."
      />

      <div className="grid gap-6 max-w-3xl">
        <Card id="privacy" className="p-6">
          <h2 className="text-headline-md text-on-surface">Privacy policy</h2>
          <p className="mt-2 text-body-md text-on-surface-variant">
            The Mo Ibrahim Foundation processes your data to deliver the NGN
            Portal. We do not sell your data and we share it only with the
            members of your network as you choose.
          </p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            For data requests, contact{" "}
            <a className="text-primary hover:underline" href="mailto:privacy@example.org">
              privacy@example.org
            </a>
            .
          </p>
        </Card>

        <Card id="terms" className="p-6">
          <h2 className="text-headline-md text-on-surface">Terms of service</h2>
          <p className="mt-2 text-body-md text-on-surface-variant">
            By using the NGN Portal you agree to engage respectfully with
            fellow members, to honour the confidentiality of mentorship
            conversations, and to abide by the Foundation&apos;s code of conduct.
          </p>
        </Card>

        <Card id="code" className="p-6">
          <h2 className="text-headline-md text-on-surface">Code of conduct</h2>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Be generous. Be specific. Be honest. Treat fellow members the way
            you&apos;d hope to be treated yourself. Programme admins may
            moderate content that violates this code.
          </p>
        </Card>
      </div>
    </>
  );
}
