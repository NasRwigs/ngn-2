"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  MIN_PASSWORD_LENGTH,
  passwordMeetsMinLength,
} from "@/lib/auth/password";
import { isSupabaseEnabled } from "@/lib/supabase/config";

import { updatePasswordAction } from "../actions";

export function ConfirmResetForm() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const strength = scorePassword(password);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (!passwordMeetsMinLength(password)) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (strength < 3) {
      setError("Password is too weak.");
      return;
    }
    setSubmitting(true);
    if (isSupabaseEnabled()) {
      const res = await updatePasswordAction(password);
      if (!res.ok) {
        setError(res.error);
        setSubmitting(false);
        return;
      }
    } else {
      await new Promise((r) => setTimeout(r, 400));
    }
    setSubmitting(false);
    router.push("/login");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="New password" htmlFor="password" required>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-4 gap-1" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={
              i < strength
                ? strength < 2
                  ? "h-1 rounded bg-error"
                  : strength < 3
                    ? "h-1 rounded bg-warning"
                    : "h-1 rounded bg-success"
                : "h-1 rounded bg-surface-container-high"
            }
          />
        ))}
      </div>
      <p className="text-xs text-on-surface-variant">
        Strength: {STRENGTH_LABEL[strength]}
      </p>

      <FormField label="Confirm password" htmlFor="confirm" required>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />
      </FormField>

      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={submitting} fullWidth size="lg">
        Update password
      </Button>
    </form>
  );
}

const STRENGTH_LABEL = ["very weak", "weak", "fair", "good", "strong"];

function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(4, score);
}
