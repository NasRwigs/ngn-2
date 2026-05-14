import Link from "next/link";

import { ResetPasswordForm } from "./reset-form";

export const metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <div className="min-h-dvh grid place-items-center p-6 md:p-12">
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
          Reset your password
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <div className="mt-8">
          <ResetPasswordForm />
        </div>

        <p className="mt-6 text-sm text-on-surface-variant">
          <Link href="/login" className="text-primary font-medium hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
