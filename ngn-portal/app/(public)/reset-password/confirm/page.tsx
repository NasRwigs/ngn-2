import Link from "next/link";

import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password";

import { ConfirmResetForm } from "./confirm-form";

export const metadata = { title: "Choose a new password" };

export default function ConfirmResetPage() {
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
          Choose a new password
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Pick a strong password — at least {MIN_PASSWORD_LENGTH} characters with
          a mix of letters and numbers.
        </p>

        <div className="mt-8">
          <ConfirmResetForm />
        </div>
      </div>
    </div>
  );
}
