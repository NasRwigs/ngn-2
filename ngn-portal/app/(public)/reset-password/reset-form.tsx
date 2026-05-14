"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { isSupabaseEnabled } from "@/lib/supabase/config";

import { requestPasswordResetAction } from "./actions";

export function ResetPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<"idle" | "sent">("idle");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    if (isSupabaseEnabled()) {
      const res = await requestPasswordResetAction(email);
      if (!res.ok) {
        setSubmitting(false);
        return;
      }
    } else {
      await new Promise((r) => setTimeout(r, 400));
    }
    setSubmitting(false);
    setState("sent");
  }

  if (state === "sent") {
    return (
      <Card className="p-5" accent="blue">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="font-bold text-on-surface">Check your inbox</h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              We&apos;ve sent a reset link to <strong>{email}</strong>. The link
              expires in 60 minutes.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="Email" htmlFor="email" required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormField>
      <Button type="submit" loading={submitting} fullWidth size="lg">
        Send reset link
      </Button>
    </form>
  );
}
