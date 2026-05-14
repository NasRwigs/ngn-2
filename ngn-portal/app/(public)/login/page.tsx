import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      <aside className="hidden lg:flex items-end bg-primary text-on-primary p-12 bg-afro-pattern">
        <div className="max-w-md">
          <Link href="/landing" className="inline-flex items-center gap-2 font-bold">
            <div className="size-8 rounded bg-on-primary text-primary grid place-items-center font-bold">
              N
            </div>
            NGN Portal
          </Link>
          <h2 className="mt-12 text-headline-lg font-bold">
            Welcome back to the network.
          </h2>
          <p className="mt-4 text-body-lg opacity-90">
            Continue your mentorship, register for upcoming events, and join the
            conversation.
          </p>
        </div>
      </aside>

      <main className="grid place-items-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <Link
            href="/landing"
            className="lg:hidden inline-flex items-center gap-2 font-bold text-on-surface mb-8"
          >
            <div className="size-8 rounded bg-primary text-on-primary grid place-items-center font-bold">
              N
            </div>
            NGN Portal
          </Link>

          <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface">
            Sign in
          </h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Welcome back. Sign in to continue.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-sm text-on-surface-variant">
            New to NGN?{" "}
            <Link
              href="/onboarding"
              className="text-primary font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>

          {process.env.NODE_ENV !== "production" && (
            <p className="mt-3 text-xs text-on-surface-variant">
              <Link href="/dev/persona" className="hover:underline">
                Dev: switch persona →
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
