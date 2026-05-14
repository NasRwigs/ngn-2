/**
 * Dev persona switcher.
 *
 * Sets the `ngn_persona` cookie that drives `getCurrentUser()`. Use to test
 * role-gated UI without a real auth backend. This route is only mounted in
 * non-production environments.
 */

import { redirect } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { findMemberByPersona, personas } from "@/lib/data/personas";
import { getPersonaKey } from "@/lib/auth/session";

export const metadata = {
  title: "Dev persona switcher",
  robots: { index: false, follow: false },
};

async function setPersona(formData: FormData) {
  "use server";
  const key = formData.get("key");
  if (typeof key !== "string") return;
  const { cookies } = await import("next/headers");
  const store = await cookies();
  store.set("ngn_persona", key, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/");
}

export default async function DevPersonaPage() {
  if (process.env.NODE_ENV === "production") {
    redirect("/");
  }

  const current = await getPersonaKey();

  return (
    <div className="min-h-dvh grid place-items-center p-6 bg-surface">
      <Card className="w-full max-w-md p-6 space-y-4">
        <header>
          <h1 className="text-headline-md text-on-surface">Dev persona</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Switch the signed-in user. This is a dev-only seam — the production
            build will use Supabase Auth.
          </p>
        </header>

        <ul className="space-y-2">
          {(Object.keys(personas) as Array<keyof typeof personas>).map(
            (key) => {
              const member = findMemberByPersona(key);
              const persona = personas[key];
              const isActive = key === current;
              return (
                <li key={key}>
                  <form action={setPersona}>
                    <input type="hidden" name="key" value={key} />
                    <Button
                      type="submit"
                      variant={isActive ? "primary" : "secondary"}
                      className="w-full justify-start"
                    >
                      <span className="flex flex-col items-start text-left">
                        <span>{persona.label}</span>
                        {member && (
                          <span className="text-xs opacity-80 mt-0.5">
                            {member.title} · {member.organisation}
                          </span>
                        )}
                      </span>
                    </Button>
                  </form>
                </li>
              );
            },
          )}
        </ul>

        <p className="text-xs text-on-surface-variant pt-2">
          Current: <code className="font-mono">{current}</code>
        </p>

        <Link
          href="/"
          className="block text-sm text-primary hover:underline pt-2"
        >
          Back to app →
        </Link>
      </Card>
    </div>
  );
}
