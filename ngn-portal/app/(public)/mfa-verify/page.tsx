import Link from "next/link";

import { VerifyMfaForm } from "./verify-form";

export const metadata = { title: "Verify two-factor authentication" };

export default function MfaVerifyPage() {
  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-sm">
        <Link
          href="/landing"
          className="inline-flex items-center gap-2 font-bold text-on-surface mb-8"
        >
          <div className="size-8 rounded bg-primary text-on-primary grid place-items-center font-bold">
            N
          </div>
          NGN Portal
        </Link>

        <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface">
          Verify it&apos;s you
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Enter the 6-digit code from your authenticator app.
        </p>

        <div className="mt-8">
          <VerifyMfaForm />
        </div>
      </div>
    </div>
  );
}
